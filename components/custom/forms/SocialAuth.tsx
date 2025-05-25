import React from 'react'
import ReusableButton from './ReusableButton'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { LOGIN_REDIRECT } from '@/routes'

const SocialAuth = () => {
    const handleClick = (provider: "google" | "github") => {
        signIn(provider, {
            redirectTo: LOGIN_REDIRECT
        })
    }
  return (
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-4">
          <ReusableButton
            label="Sign in with google"
            className="bg-white hover:bg-white border-emerald-400 hover:border-emerald-600"
            leftIcon={<FcGoogle size={24} />}
            onClick={() => handleClick("google")}
          />
          <ReusableButton
          onClick={() => handleClick("github")}
            label="Sign in with github"
            className="bg-white hover:bg-white border-emerald-400 hover:border-emerald-600"
            leftIcon={<FaGithub size={24} />}
          />
        </div>
  )
}

export default SocialAuth