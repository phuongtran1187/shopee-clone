import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type RuleValidation = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

export const getRules = (getValues?: UseFormGetValues<any>): RuleValidation => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc!'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email không đúng định dạng!'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5-160 ký tự!'
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5-160 ký tự!'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc!'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5-160 ký tự!'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 5-160 ký tự!'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Nhập lại password là bắt buộc!'
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5-160 ký tự!'
    },
    minLength: {
      value: 6,
      message: 'Độ dài từ 5-160 ký tự!'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Nhập lại password không khớp!'
        : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_min) <= Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập laị password là bắt buộc')
    .min(6, 'Độ dài từ 6-160 ký tự!')
    .max(160, 'Độ dài từ 6-160 ký tự!')
    .oneOf([yup.ref(refString)], 'Nhập lại password không chính xác!')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng!')
    .min(5, 'Độ dài từ 5-160 ký tự!')
    .max(160, 'Độ dài từ 5-160 ký tự!'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6-160 ký tự!')
    .max(160, 'Độ dài từ 6-160 ký tự!'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price_not_allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price_not_allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc!')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự!'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự!'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự!'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ!'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 100 ký tự!'),
  password: schema.fields['password'] as yup.StringSchema<string, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPasswordYup('new_password')
})

export type SchemaType = yup.InferType<typeof schema>
export const schemaLogin = schema.pick(['email', 'password'])
export type SchemaLoginType = yup.InferType<typeof schemaLogin>
export const schemaRegister = schema.pick(['email', 'password', 'confirm_password'])
export type SchemaRegisterType = yup.InferType<typeof schemaRegister>

export type UserSchemaType = yup.InferType<typeof userSchema>
