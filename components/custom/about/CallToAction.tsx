import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
          Ready to Connect?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          I'd love to hear from you! Whether you have questions, ideas, or just
          want to chat about technology and innovation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-xl group"
          >
            <Mail className="mr-2 h-5 w-5" />
            Get In Touch
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:transform hover:-translate-y-1"
          >
            Read My Blog
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
