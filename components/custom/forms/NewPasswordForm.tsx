"use client";

import { BsCodeSquare } from "react-icons/bs";
import FormField from "./FormField";
import Alert from "./Alert";
import ReusableButton from "./ReusableButton";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbLockPassword } from "react-icons/tb";
import SocialAuth from "./SocialAuth";
import { PasswordResetShema, PasswordResetShemaType } from "@/schemas/PasswordResetShema";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordReset } from "@/actions/auth/password-reset";

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const router = useRouter()
  const token = searchParams.get("token") ?? undefined;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetShemaType>({ resolver: zodResolver(PasswordResetShema) });
  const handleSubmitForm: SubmitHandler<PasswordResetShemaType> = async (data) => {
    setError("");
    setSuccess("");

    startTransition(() => {
        PasswordReset(data, token).then(res => {
            if (res.error) {
                setError(res.error)
            }
            if (res.success) {
                setSuccess(res.success)
                router.replace("/login")
            }
        })
    });
  };
  return (
    <div className="h-full pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:border bg-white md:border-border md:shadow-sm relative">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex px-4 justify-center gap-4 mb-6 h-12 border-b border-border items-center w-full">
            <BsCodeSquare size={28} className="text-emerald-400" />
            <span className="font-extrabold text-2xl">JSPEEPS.DEV</span>
          </div>
          <h2 className="text-2xl font-semibold text-center text-black mb-6">
            Set a new password?
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium uppercase mb-4 text-black"
              >
                New Password
              </label>
              <div className="relative">
                <FormField
                  id="password"
                  type="password"
                  register={register}
                  errors={errors}
                  disabled={isPending}
                  placeholder="Fill in your password"
                  leftIcon={
                    <TbLockPassword size={24} className="text-emerald-400" />
                  }
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium uppercase mb-4 text-black"
              >
                Confirm Password
              </label>
              <div className="relative">
                <FormField
                  id="confirmPassword"
                  type="password"
                  register={register}
                  errors={errors}
                  disabled={isPending}
                  placeholder="Fill in your password"
                  leftIcon={
                    <TbLockPassword size={24} className="text-emerald-400" />
                  }
                />
              </div>
            </div>
            {error && <Alert message={error} error />}
            {success && <Alert message={success} success />}
            <ReusableButton
              type="submit"
              disabled={isPending}
              label={isPending ? "saving" : "Save"}
              className="border-emerald-400 hover:border-emerald-600 bg-white hover:bg-white"
            />
          </form>
        </div>
        <div className="flex md:hidden items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <div className="hidden md:flex items-center justify-center px-2 text-gray-400 font-medium">
          <div className="h-3/4 w-px bg-gray-300 relative">
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-2 text-sm">
              OR
            </span>
          </div>
        </div>
        <SocialAuth />
      </div>
    </div>
  );
};

export default NewPasswordForm;
