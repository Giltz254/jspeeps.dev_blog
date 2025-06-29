import { auth } from "@/auth";
import Navbar from "@/components/custom/navbar/Navbar";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "sonner";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <SessionProvider>
      <div className={cn("flex flex-col min-h-screen w-full")}>
        <Navbar session={session} />
        <main>
          {children}
          <Toaster position="bottom-left" />
        </main>
      </div>
    </SessionProvider>
  );
};

export default HomeLayout;
