import { auth } from "@/auth";
import Navbar from "@/components/custom/navbar/Navbar";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import React from "react";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider>
      <div className={cn("flex flex-col min-h-screen w-full")}>
        <Navbar session={session} />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
};

export default HomeLayout;
