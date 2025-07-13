import ContactForm from "@/components/custom/layout/ContactForm";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-white w-full">
      <div className="flex flex-col max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4">
            <h1 className="text-3xl border rounded-full w-max px-4 py-2 sm:text-4xl font-bold text-gray-900">
              Chat me
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Using Jspeeps? Sign in so we can contact you for support. If
              that's not possible, send us your request manually.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default page;
