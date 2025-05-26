import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
    const date = new Date()
    const year = date.getFullYear()
  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-6">
          <div className="flex flex-col md:flex-row items-center space-x-10">
            <Link href="/blog/feed/1" className="text-xl font-semibold tracking-widest text-black">
              <span className="text-pink-600">/</span>JSPEEPS<span className="font-normal">.DEV</span>
            </Link>
            <div className="space-x-8 text-base text-gray-700 flex items-center flex-wrap">
              <Link href="/about">About</Link>
              <Link href="/support">Support</Link>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="https://x.com/Godffre02145902"><FaTwitter className="text-gray-600 hover:text-black" size={18} /></Link>
            <Link href="#"><FaFacebookF className="text-gray-600 hover:text-black" size={18} /></Link>
            <Link href="#"><FaInstagram className="text-gray-600 hover:text-black" size={18} /></Link>
            <Link target="_blank" href="https://github.com/Giltz254"><FaGithub className="text-gray-600 hover:text-black" size={18} /></Link>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 pb-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <span>© Copyright {year}, All Rights Reserved</span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
