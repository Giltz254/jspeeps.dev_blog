import React from "react";
import ReusableButton from "./ReusableButton";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

const SocialAuth = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl");
  const handleClick = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: callbackUrl || LOGIN_REDIRECT,
    });
  };
  return (
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-4">
      <ReusableButton
        label="Continue with Google"
        className="cursor-pointer"
        leftIcon={<FcGoogle size={24} />}
        onClick={() => handleClick("google")}
      />
      <ReusableButton
        onClick={() => handleClick("github")}
        label="Continue with Github"
        leftIcon={<FaGithub size={24} />}
        className="cursor-pointer"
      />
    </div>
  );
};

export default SocialAuth;
