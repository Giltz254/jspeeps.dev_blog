'use client';
import { ArrowDown } from 'lucide-react';
const ScrollIndicatorButton = () => {
  const scrollToContent = () => {
    const element = document.getElementById('main-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToContent}
      className="mt-12 inline-flex items-center justify-center p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 group"
      aria-label="Scroll to content"
    >
      <ArrowDown className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
    </button>
  );
};

export default ScrollIndicatorButton;
