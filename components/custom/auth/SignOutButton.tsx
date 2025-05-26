"use client";
import { signOut } from 'next-auth/react'
import { CiLogin } from "react-icons/ci";
const SignOutButton = () => {
  return (
    <button className="px-4 py-2 cursor-pointer w-full bg-rose-500 text-white rounded hover:bg-red-700 transition font-medium flex items-center justify-center text-base gap-4" onClick={() => signOut()}>
      <CiLogin size={24} />
      <span>Sign Out</span>
    </button>
  )
}

export default SignOutButton