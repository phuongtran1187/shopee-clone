import { range } from 'lodash'
import React, { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = e.target
    const newDate = {
      date: value?.getDate() || 1,
      month: value?.getMonth() || 0,
      year: value?.getFullYear() || 1990,
      [name]: valueFromSelect
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            value={value?.getDate() || date.date}
            name='date'
            onChange={handleOnChange}
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              )
            })}
          </select>
          <select
            value={value?.getMonth() || date.month}
            name='month'
            onChange={handleOnChange}
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => {
              return (
                <option value={item} key={item}>
                  {item + 1}
                </option>
              )
            })}
          </select>
          <select
            value={value?.getFullYear() || date.year}
            name='year'
            onChange={handleOnChange}
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Năm</option>
            {range(1900, 2024).map((item) => {
              return (
                <option value={item} key={item}>
                  {item}
                </option>
              )
            })}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] cursor-pointer text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
