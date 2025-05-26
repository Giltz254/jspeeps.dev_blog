"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "./FormField";
import { BsCodeSquare } from "react-icons/bs";
import { MdMailOutline } from "react-icons/md";
import ReusableButton from "./ReusableButton";
import { useState, useTransition } from "react";
import Alert from "./Alert";
import SocialAuth from "./SocialAuth";
import {
  PasswordEmailSchema,
  PasswordEmailSchemaType,
} from "@/schemas/ResetPasswordEmailSchema";
import { passwordResetEmail } from "@/actions/auth/password-reset-email";

const PasswordResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordEmailSchemaType>({
    resolver: zodResolver(PasswordEmailSchema),
  });

  const handleSendOtp: SubmitHandler<PasswordEmailSchemaType> = async (
    data
  ) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      passwordResetEmail(data).then(res => {
        if (res.error) {
          setError(res.error)
        }
        if (res.success) {
          setSuccess(res.success)
        }
      })
    });
  };

  return (
    <div className="h-full pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:border bg-white md:border-border md:rounded-md relative">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex px-4 justify-center gap-4 mb-6 h-12 border-b border-border items-center w-full">
            <BsCodeSquare size={28} className="text-black" />
            <span className="font-extrabold text-2xl">JSPEEPS.DEV</span>
          </div>
          <h2 className="text-2xl font-semibold text-center text-black mb-6">
            Recover Your Account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(handleSendOtp)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium uppercase mb-4 text-black"
              >
                Email Address
              </label>
              <FormField
                id="email"
                register={register}
                errors={errors}
                placeholder="Enter your email"
                disabled={isPending}
                leftIcon={
                  <MdMailOutline size={24} className="text-black" />
                }
              />
            </div>

            {error && <Alert message={error} error />}
            {success && <Alert message={success} success />}
            <ReusableButton
              type="submit"
              disabled={isPending}
              label={isPending ? "Sending..." : "Send Password Reset Link"}
              className="w-full cursor-pointer"
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

export default PasswordResetForm;
