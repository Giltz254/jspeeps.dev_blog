import ContactFormSection from "@/components/custom/layout/ContactFormSection";
import ContactSupportHero from "@/components/custom/layout/ContactSupportHero";
import React from "react";

const page = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <ContactSupportHero />
      <ContactFormSection />
    </main>
  );
};

export default page;
