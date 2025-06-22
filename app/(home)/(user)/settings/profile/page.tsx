import ProfileForm from '@/components/custom/forms/ProfileForm';
import { getUserId } from '@/lib/userId';
import { notFound } from 'next/navigation';
import React from 'react';

export type profilePageProps = {
  name: string;
  username: string;
  password: string | null;
  website: string | null;
  twitter: string | null;
  bio: string | null;
  provider: "credentials" | "google" | "github";
  email: string;
  emailVerified: Date;
};

const page = async () => {
  const userId = await getUserId();
  let errorMessage: string | null = null;
  if (!userId) {
    notFound();
  }
  let user: profilePageProps | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users?userId=${userId}`, {
      cache: "force-cache",
      next: {
        tags: ["users"]
      }
    });

    if (!res.ok) {
      const errorBody = await res.text();
      errorMessage = `Failed to load profile data: ${res.status} - ${errorBody || 'Unknown error'}`;
    } else {
      user = await res.json();
    }
  } catch (error: any) {
    errorMessage = `An unexpected error occurred: ${error.message || 'Please try again later.'}`;
  }
  if (errorMessage) {
    return (
      <div className="pt-10 pb-20 w-full bg-white">
        <div className='max-w-7xl min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 w-full'>
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.348a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.652a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.652 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (user) {
    return (
      <div className="pt-10 pb-20 w-full bg-white">
        <div className='max-w-7xl min-h-[calc(100vh-64px)] mx-auto px-4 sm:px-6 lg:px-8 w-full'>
          <ProfileForm user={user} />
        </div>
      </div>
    );
  }
  return null;
};

export default page;