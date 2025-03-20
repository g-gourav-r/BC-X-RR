import React from "react";
import { Spotlight } from "./ui/spotlight-new";
import { FlipWords } from "./ui/flip-words";

const Hero = () => {
  const words = ["Match  ", "Moment", "Way    "];
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center antialiased bg-gradient-to-b from-blue-900 to-pink-900 relative overflow-hidden">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(330, 90%, 60%, .08) 0, hsla(240, 100%, 30%, .02) 50%, hsla(240, 100%, 20%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(330, 90%, 70%, .06) 0, hsla(240, 100%, 40%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(330, 90%, 50%, .04) 0, hsla(240, 100%, 25%, .02) 80%, transparent 100%)"
        gradientWhite="radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.3), transparent 80%)"
        translateY={-200}
        width={800}
        height={1500}
        smallWidth={300}
        duration={3}
        xOffset={150}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 py-8">
        {/* Branding Image */}
        <img src="/halla-bol.png" alt="Halla Bol" className="max-w-xs mb-6" />

        {/* Static Intro Text */}
        <div className="max-w-3xl mb-8">
          <p className="text-lg text-gray-200 font-trajan leading-relaxed">
            Tired of waiting for someone else to create that perfect post so you
            can share your favorite match moments on Instagram or WhatsApp?
          </p>
          <p className="text-lg text-gray-200 font-trajan leading-relaxed mt-4">
            Now, you're in control! Create your own unique posts featuring the
            exact moments you loved from the game—instantly.
          </p>
        </div>

        {/* Dynamic Looping Text */}
        <div className="text-5xl font-bold font-trajan text-white">
          Your <FlipWords duration={50} words={words} />
        </div>
      </div>
      <div className="flex flex-col items-center mt-8">
        <p className="text-sm text-gray-300 mb-2">Scroll to read more</p>
        <svg
          className="w-6 h-6 text-gray-300 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
