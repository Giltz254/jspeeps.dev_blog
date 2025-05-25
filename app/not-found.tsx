import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-[calc(100vh-64px)] relative flex flex-col items-center justify-center bg-gray-50/20 px-6 lg:px-8 overflow-hidden">
      {/* Animated SVG Blob */}
      <svg
        className="absolute -top-20 -left-20 w-[500px] h-[500px] animate-blob opacity-30 text-emerald-300"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M44.8,-66.3C56.6,-56.3,63.5,-42.5,69.1,-28.2C74.7,-13.9,79,1,75.2,14.9C71.5,28.7,59.7,41.4,46.2,51.3C32.7,61.3,16.3,68.6,0.3,68.2C-15.6,67.7,-31.3,59.5,-43.9,48.5C-56.5,37.5,-66,23.6,-70.3,7.7C-74.5,-8.2,-73.5,-25.9,-64.9,-40.1C-56.3,-54.3,-40.2,-65.1,-23.1,-71.3C-6.1,-77.6,11.8,-79.2,28.6,-74.3C45.4,-69.3,61.1,-57.4,44.8,-66.3Z"
          transform="translate(100 100)"
        />
      </svg>

      <div className="relative z-10 max-w-md mx-auto border bg-white px-6 py-8 flex flex-col gap-6 rounded-md shadow-xl">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-4xl font-extrabold text-black text-center">
            404 - Not Found
          </h2>
          {/* Compass SVG */}
          <svg
            className="w-12 h-12 text-emerald-500 animate-spin-slow"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.2"
            />
            <path
              d="M32 12L37 32L32 52L27 32L32 12Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="32" r="5" fill="white" />
            <circle
              cx="32"
              cy="32"
              r="2"
              fill="currentColor"
              className="origin-center animate-waverotate"
            />
          </svg>
        </div>
        <p className="text-base font-medium text-gray-700">
          Oops! This obviously is not the page you were looking for. Please use
          the following link to move to a safe harbour.
        </p>
        <Link
          href="/blog/feed/1"
          className="inline-block bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold px-6 py-3 rounded-full shadow-md
                     hover:from-teal-500 hover:to-emerald-400 text-center hover:shadow-lg transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
