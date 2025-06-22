import RegisterForm from '@/components/custom/forms/RegisterForm'
import { db } from '@/lib/db'
import React from 'react'

const page = async () => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </div>
  )
}

export default page