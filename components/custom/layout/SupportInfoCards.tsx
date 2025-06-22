import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface InfoCardProps {
  title: string;
  description: React.ReactNode;
  icon: React.ElementType;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="p-6 bg-white border-b border-gray-200 flex flex-col items-start text-left">
      <div className="flex items-center justify-center p-2 rounded-full bg-indigo-50 text-indigo-600 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="text-gray-600 text-base leading-relaxed">{description}</div>
    </div>
  );
};

const SupportInfoCards: React.FC = () => {
  return (
    <div className="space-y-8">
      <InfoCard
        title="Email support"
        description={
          <>
            Email me and I&apos;ll get back to you within 24 hours.
            <br />
            <Link href="mailto:webblogbuild@gmail.com" className="text-indigo-600 hover:underline">webblogbuild@gmail.com</Link>
          </>
        }
        icon={Mail}
      />
    </div>
  );
};

export default SupportInfoCards;