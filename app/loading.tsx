import Loader from '@/components/custom/Loader'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-[calc(100vh-64px)] bg-gray-50'>
        <Loader />
    </div>
  )
}

export default loading