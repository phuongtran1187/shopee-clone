import React from 'react'

export default function SortProductist() {
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button className='h-8 bg-orange px-4 text-center text-sm capitalize text-white hover:bg-orange/80'>
            Phổ biến
          </button>
          <button className='h-8 bg-white px-4 text-center text-sm capitalize text-black hover:bg-slate-100'>
            Mới nhất
          </button>
          <button className='h-8 bg-white px-4 text-center text-sm capitalize text-black hover:bg-slate-100'>
            Bán chạy
          </button>
          <select className='h-8 bg-white px-4 text-left text-sm capitalize text-black outline-none hover:bg-slate-100'>
            <option value='price'>Giá</option>
            <option value='price:asc'>Giá: Thấp đến cao</option>
            <option value='price:desc'>Giá: Cao xuống thấp</option>
          </select>
        </div>
        <div className='flex items-center text-center'>
          <div>
            <span className='text-orange'>1</span>
            <span>/2</span>
          </div>
          <div className='ml-2 flex gap-2'>
            <div className='flex h-8 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60 px-3 hover:bg-slate-100'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-3 w-3'>
                <path
                  fillRule='evenodd'
                  d='M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='flex h-8 cursor-not-allowed items-center justify-center rounded-tr-sm rounded-br-sm bg-white/60 px-3 hover:bg-slate-100'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-3 w-3'>
                <path
                  fillRule='evenodd'
                  d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
