"use client";

import FormField from "./FormField";
import ReusableButton from "./ReusableButton";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbLockPassword } from "react-icons/tb";
import SocialAuth from "./SocialAuth";
import { PasswordResetShema, PasswordResetShemaType } from "@/schemas/PasswordResetShema";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordReset } from "@/actions/auth/password-reset";
import Logo from "./Logo";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter()
  const token = searchParams.get("token") ?? undefined;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetShemaType>({ resolver: zodResolver(PasswordResetShema) });
  const handleSubmitForm: SubmitHandler<PasswordResetShemaType> = async (data) => {
   startTransition(() => {
        PasswordReset(data, token).then(res => {
            if (res.error) {
                showErrorToast(res.error)
            }
            if (res.success) {
                showSuccessToast(res.success)
                router.replace("/login")
            }
        })
    });
  };
  return (
    <div className="h-full pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white relative">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex px-4 justify-center gap-4 mb-6 h-12 items-center w-full">
            <Logo />
          </div>
          <h2 className="text-2xl font-semibold text-center text-black mb-6">
            Set a new password
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium uppercase mb-4 text-black"
              >
                Password
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
                    <TbLockPassword size={24} className="text-black" />
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
                    <TbLockPassword size={24} className="text-black" />
                  }
                />
              </div>
            </div>
            <ReusableButton
              type="submit"
              disabled={isPending}
              label={isPending ? "saving" : "Save"}
              className="w-full"
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
