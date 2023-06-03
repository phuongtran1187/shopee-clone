import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { path } from 'src/constants/path'

export default function NotFound() {
  return (
    <div className='flex h-screen w-screen items-center bg-gray-100'>
      <Helmet>
        <title>404 - Shopee Clone</title>
        <meta name='description' content='Page Not Found' />
      </Helmet>
      <div className='container flex flex-col items-center justify-center px-5 text-gray-700'>
        <div className='max-w-md'>
          <div className='font-dark text-6xl font-bold'>
            Uppsss...
            <strong> 404 </strong>
          </div>
        </div>

        <div className='mt-10 text-2xl font-light leading-normal md:text-3xl'>
          <strong>Page Not Found</strong>
        </div>

        <Link
          to={path.home}
          className='mt-10 inline rounded-lg border border-transparent bg-orange py-2 px-6 text-white'
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
