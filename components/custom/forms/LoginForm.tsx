"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import FormField from "./FormField";
import { MdMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import ReusableButton from "./ReusableButton";
import Link from "next/link";
import { useEffect, useTransition } from "react";
import { Login } from "@/actions/auth/login";
import { useRouter } from "next/navigation";
import { LOGIN_REDIRECT } from "@/routes";
import SocialAuth from "./SocialAuth";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/auth/email-verification";
import { showErrorToast, showSuccessToast } from "../layout/Toasts";
import AnimatedLogo from "./AnimatedLogo";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  if (urlError) {
    showErrorToast(urlError);
  }
  const callbackUrl = searchParams.get("callbackUrl");
  const token = searchParams.get("token") ?? undefined;
  useEffect(() => {
    if (token) {
      verifyEmail(token).then((res) => {
        if (res.success) {
          showSuccessToast(res.success);
          router.replace("/login");
        }
        if (res.error) {
          showErrorToast(res.error);
        }
      });
    }
    if (!token) return;
  }, [token]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });
  const handleSubmitForm: SubmitHandler<LoginSchemaType> = async (data) => {
    startTransition(() => {
      (async () => {
        const res = await Login(data, callbackUrl);
        if (res?.error) {
          showErrorToast(res.error);
        } else if (res?.requiresVerification) {
          showSuccessToast(res.success);
        } else {
          router.push(callbackUrl || LOGIN_REDIRECT);
        }
      })();
    });
  };
  return (
    <div className="h-full py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white relative">
        <div className="w-full flex flex-col gap-y-4 md:w-1/2 md:pr-4">
          <div className="flex px-4 justify-center gap-4 mb-6 h-12 items-center w-full">
            <AnimatedLogo />
          </div>
          <h2 className="text-2xl font-semibold text-center text-black mb-6">
            Log into your account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
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
                placeholder="Fill in your email"
                disabled={isPending}
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
              <div className="relative flex flex-col gap-1">
                <FormField
                  id="password"
                  type="password"
                  register={register}
                  errors={errors}
                  disabled={isPending}
                  placeholder="Fill in your password"
                  leftIcon={<TbLockPassword size={24} className="text-black" />}
                />
                <Link
                  href={"/forgot-password"}
                  className="text-sm text-right mt-2 text-blue-600 font-medium transition-all duration-300 cursor-pointer hover:text-blue-700"
                >
                  Forgot password
                </Link>
              </div>
            </div>
            <ReusableButton
              type="submit"
              disabled={isPending}
              label={isPending ? "signing in" : "Sign in"}
              className="w-full cursor-pointer text-sm"
            />
          </form>
          <div className="text-base mt-6 flex items-center gap-2 font-medium">
            <span className="font-normal text-gray-700">
              Don't have an account yet?
            </span>
            <Link
              href="/register"
              className="text-sm font-medium text-blue-600 hover:underline transition-all duration-300"
            >
              Register
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

export default LoginForm;
