"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "./FormField";
import { MdMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import ReusableButton from "./ReusableButton";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import { SignUp } from "@/actions/auth/Register";
import { useTransition } from "react";
import SocialAuth from "./SocialAuth";
import Link from "next/link";
import { User } from "lucide-react";
import Logo from "./Logo";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(RegisterSchema) });
  const handleSubmitForm: SubmitHandler<RegisterSchemaType> = (data) => {
    startTransition(() => {
      SignUp(data).then((res) => {
        if (res.error) {
          showErrorToast(res.error);
        }
        if (res.success) {
          showSuccessToast(res.success);
          reset();
        }
      });
    });
  };
  return (
    <div className="h-full py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white relative">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex px-4 justify-center gap-4 mb-6 h-12 items-center w-full">
            <Logo />
          </div>
          <h2 className="text-2xl font-semibold text-center text-black mb-6">
            Register an account?
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium uppercase mb-4 text-black"
              >
                Fullname
              </label>
              <FormField
                id="name"
                register={register}
                errors={errors}
                disabled={isPending}
                placeholder="Fill in your name"
                leftIcon={<User size={24} className="text-black" />}
              />
            </div>
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
                disabled={isPending}
                placeholder="Fill in your email"
                leftIcon={<MdMailOutline size={24} className="text-black" />}
              />
            </div>
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
                  leftIcon={<TbLockPassword size={24} className="text-black" />}
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
                  placeholder="Fill in your password"
                  disabled={isPending}
                  leftIcon={<TbLockPassword size={24} className="text-black" />}
                />
              </div>
            </div>
            <ReusableButton
              type="submit"
              disabled={isPending}
              label={isPending ? "Signing up" : "Sign up"}
              className="w-full"
            />
          </form>
          <div className="text-base mt-6 flex items-center gap-2 font-medium">
            <span className="font-normal text-gray-700">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="text-base font-medium text-black hover:underline transition-all duration-300"
            >
              Sign in
            </Link>
          </div>
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

export default RegisterForm;
