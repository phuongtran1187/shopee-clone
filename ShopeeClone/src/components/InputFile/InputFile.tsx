import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files?.[0]
    if (fileInput && (fileInput.size >= config.maxSizeAvatar || !fileInput.type.includes('image'))) {
      toast.error('Ảnh không đúng định dạng!', {
        autoClose: 1000
      })
    } else {
      onChange && onChange(fileInput)
    }
  }
  const handleClickBtnUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={handleChangeFile}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(e) => ((e.target as any).value = null)}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        type='button'
        onClick={handleClickBtnUpload}
      >
        Chọn ảnh
      </button>
    </>
  )
}
