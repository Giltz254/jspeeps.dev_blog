"use client";
import { signOut } from 'next-auth/react'
import ReusableButton from '../forms/ReusableButton';
import { CiLogin } from "react-icons/ci";
const SignOutButton = () => {
  return (
    <ReusableButton className="px-4 py-2 cursor-pointer w-full bg-rose-500 text-white rounded hover:bg-red-700 transition font-medium" label='Sign Out' leftIcon={<CiLogin size={24} />} onClick={() => signOut()} />
  )
}

export default SignOutButton