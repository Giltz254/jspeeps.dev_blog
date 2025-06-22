import Loader from '@/components/custom/Loader'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full bg-accent min-h-[calc(100vh-128px)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center'>
            <Loader />
        </div>
    </div>
  )
}

export default loading