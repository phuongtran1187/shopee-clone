import React, { useState } from 'react'
import InputNumber, { inputNumberProps } from '../InputNumber'

interface Props extends inputNumberProps {
  max?: number
  onType?: (value: number) => void
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  wrapClassName?: string
}

export default function QuantityController({
  max,
  onType,
  onDecrease,
  onIncrease,
  value,
  wrapClassName = 'ml-10'
}: Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 1))
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onType && onType(_value)
    setLocalValue(_value)
  }

  const increaseQuantity = () => {
    let quantity = Number(value || localValue) + 1
    if (max !== undefined && quantity > max) {
      quantity = max
    }
    onIncrease && onIncrease(quantity)
    setLocalValue(quantity)
  }

  const decreaseQuantity = () => {
    let quantity = Number(value || localValue) - 1
    if (quantity < 1) quantity = 1
    onDecrease && onDecrease(quantity)
    setLocalValue(quantity)
  }

  return (
    <div className={`${wrapClassName} flex items-center`}>
      <button
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-500 text-gray-600'
        onClick={decreaseQuantity}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        className=''
        classNameError='hidden'
        classNameInput='h-8 w-16 border-t border-b border-gray-500 p-1 text-center outline-non'
        value={value || localValue}
        onChange={handleOnChange}
      />
      <button
        className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-500 text-gray-600'
        onClick={increaseQuantity}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
