import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'

type RuleValidation = { [key in 'email' | 'password' | 'confirm_password' | 'validate']?: RegisterOptions }

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
