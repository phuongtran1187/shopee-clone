import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchemaType, userSchema } from 'src/utils/rulesValidation'
import DateSelect from '../../Components/DateSelect'
import { AppContext } from 'src/context/app.context'
import { toast } from 'react-toastify'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isUnprocessableEntityError } from 'src/utils/utils'
import { ResponseErrorApi } from 'src/types/utils.type'
import InputFile from 'src/components/InputFile'

type FormData = Pick<UserSchemaType, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'avatar', 'date_of_birth'])

export default function Profile() {
  const [file, setFile] = useState<File>()
  const { setProfile } = useContext(AppContext)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getUser
  })
  const profile = profileData?.data.data

  const updateUserMutation = useMutation(userApi.updateUser)
  const updateAvatarMutation = useMutation(userApi.uploadAvatar)

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  useEffect(() => {
    if (profile) {
      setValue('name', profile?.name)
      setValue('address', profile?.address)
      setValue('phone', profile?.phone)
      setValue('avatar', profile?.avatar)
      setValue('date_of_birth', profile?.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const avatar = watch('avatar')

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarRes = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await updateAvatarMutation.mutateAsync(form)
        avatarRes = uploadRes.data.data
        setValue('avatar', avatar)
      }
      const res = await updateUserMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarRes
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      toast.success(res.data.message, {
        autoClose: 1000
      })
      refetch()
    } catch (error) {
      if (isUnprocessableEntityError<ResponseErrorApi<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              type: 'Server',
              message: formError[key as keyof FormDataError]
            })
          })
        }
      }
    }
  })

  const handleOnChangeInputFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-2 pb-10 md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-wrap'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='text'
                placeHolder='Tên của bạn'
                name='name'
                register={register}
                errorMessage={errors.name?.message}
                className=''
                classNameInput='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => {
                  return (
                    <InputNumber
                      classNameInput='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                      placeholder='Số điện thoại'
                      errorMessage={errors.phone?.message}
                      {...field}
                      onChange={field.onChange}
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                type='text'
                placeHolder='Địa chỉ của bạn'
                name='address'
                register={register}
                errorMessage={errors.address?.message}
                className=''
                classNameInput='w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />
          <div className='mt-4 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewImage || getAvatarUrl(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <InputFile onChange={handleOnChangeInputFile} />
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
