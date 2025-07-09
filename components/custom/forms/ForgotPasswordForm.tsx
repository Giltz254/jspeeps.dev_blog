"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "./FormField";
import { MdMailOutline } from "react-icons/md";
import ReusableButton from "./ReusableButton";
import { useTransition } from "react";
import SocialAuth from "./SocialAuth";
import {
  PasswordEmailSchema,
  PasswordEmailSchemaType,
} from "@/schemas/ResetPasswordEmailSchema";
import { passwordResetEmail } from "@/actions/auth/password-reset-email";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";
import AnimatedLogo from "./AnimatedLogo";

const PasswordResetForm = () => {
  const [isPending, startTransition] = useTransition();
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
    startTransition(() => {
      passwordResetEmail(data).then((res) => {
        if (res.error) {
          showErrorToast(res.error);
        }
        if (res.success) {
          showSuccessToast(res.success);
        }
      });
    });
  };

  return (
    <div className="h-full pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white relative">
        <div className="w-full md:w-1/2 flex flex-col gap-y-4 md:pr-4">
          <div className="flex px-4 justify-center gap-4 mb-6 h-12 items-center w-full">
            <AnimatedLogo />
          </div>
          <div className="flex flex-col mb-6">
            <h2 className="text-2xl font-semibold text-center text-black">
              Forgot Password
            </h2>
            <p className="text-sm text-center font-normal text-gray-700">
              No worries, we'll send you reset instructions.
            </p>
          </div>
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
                leftIcon={<MdMailOutline size={24} className="text-black" />}
              />
            </div>
            <ReusableButton
              type="submit"
              disabled={isPending}
              label={isPending ? "Sending..." : "Reset Password"}
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
