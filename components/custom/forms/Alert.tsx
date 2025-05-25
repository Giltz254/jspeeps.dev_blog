import React from 'react'
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { IoMdInformationCircle } from "react-icons/io";
import { MdDangerous } from 'react-icons/md';
import { cn } from '@/lib/utils';
interface AlertProps {
    success?: boolean;
    error?: boolean;
    message: string;
}
const Alert = ({success, error, message}: AlertProps) => {
  return (
    <div className={cn("flex items-center my-2 gap-2 p-3 rounded-md",
        success && "bg-green-100 text-green-500 text-sm", error && "bg-rose-100 text-rose-500",
        !error && !success && "bg-blue-100 text-blue-500"
    )}>
        <span>
            {success &&  <IoShieldCheckmarkSharp size={20} className='text-emerald-400' />}
            {error && <MdDangerous size={20} className='text-rose-500' />}
            {!success && !error && <IoMdInformationCircle size={20} />}
        </span>
        <span>{message}</span>
    </div>
  )
}

export default Alert