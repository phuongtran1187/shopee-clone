import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'

import Input from 'src/components/Input'
import { schemaRegister, SchemaRegisterType } from 'src/utils/rulesValidation'
import { resgisterAccount } from 'src/apis/auth.api'
import { isUnprocessableEntityError } from 'src/utils/utils'
import { ResponseErrorApi } from 'src/types/utils.type'
import { AppContext } from 'src/context/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'

type FormData = SchemaRegisterType

export default function Register() {
  const { setIsAuthentication, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schemaRegister)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => resgisterAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthentication(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isUnprocessableEntityError<ResponseErrorApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                type: 'Server',
                message: formError[key as keyof Omit<FormData, 'confirm_password'>]
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <Helmet>
        <title>Đăng ký Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Ký</div>
              <Input
                className='mt-8'
                type='email'
                placeHolder='Email'
                register={register}
                name='email'
                errorMessage={errors.email?.message}
              />
              <Input
                className='mt-2'
                type='password'
                placeHolder='Password'
                register={register}
                name='password'
                errorMessage={errors.password?.message}
              />
              <Input
                className='mt-2'
                type='password'
                placeHolder='Confirm Password'
                register={register}
                name='confirm_password'
                errorMessage={errors.confirm_password?.message}
              />
              <div className='mt-2'>
                <Button
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                  type='submit'
                  className='flex w-full items-center justify-center bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
                >
                  Đăng Ký
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/login'>
                  Đăng Nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
