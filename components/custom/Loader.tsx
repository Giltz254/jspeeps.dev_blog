"use client";
import { useEffect, useState } from "react";

const Loader = () => {
  const text = "JSPEEPS.DEV";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (currentIndex === text.length) {
      setFade(false);
      timeoutId = setTimeout(() => {
        setCurrentIndex(0);
        setFade(true);
      }, 1000);
    } else {
      setFade(true);
      timeoutId = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 100);
    }
    return () => clearTimeout(timeoutId);
  }, [currentIndex, text.length]);
  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative inline-block">
        <span className="dot dot1" />
        <span className="dot dot2" />
        <span className="dot dot3" />
        <h1
          className={`text-4xl md:text-6xl font-bold text-black tracking-widest transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {text.substring(0, currentIndex)}
          <span className="animate-blink">|</span>
        </h1>
      </div>
    </div>
  );
};

export default Loader;
