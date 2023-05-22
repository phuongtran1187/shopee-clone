import React from 'react'
import type { UseFormRegister } from 'react-hook-form'

interface PropsType {
  className: string
  classNameInput?: string
  type: React.HTMLInputTypeAttribute
  placeHolder: string
  name: string
  register: UseFormRegister<any>
  errorMessage: string | undefined
}

const Input = ({
  className,
  type,
  placeHolder,
  register,
  name,
  errorMessage,
  classNameInput = 'w-full rounded border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
}: PropsType) => {
  return (
    <div className={className}>
      <input type={type} className={classNameInput} placeholder={placeHolder} {...register(name)} />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default Input
