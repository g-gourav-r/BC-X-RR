import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import { useNavigate } from "react-router-dom";

const ProcessOverview = () => {
  const navigate = useNavigate();
  const content = [
    {
      title: "Stream Video",
      description:
        "Kick off your journey by selecting a video or live stream. Let your match moments take center stage!",
      content: (
        <img
          src="/1.png"
          alt="Upload Video"
          className="w-full h-full object-cover"
        />
      ),
    },
    {
      title: "Play & Pause",
      description:
        "Bring the game to life. Play your video and pause at that unforgettable moment.",
      content: (
        <img
          src="/2.png"
          alt="Play & Pause"
          className="w-full h-full object-cover"
        />
      ),
    },
    {
      title: "Extract Frame",
      description:
        "Freeze the magic with one click. Capture a stunning frame that highlights your best moment.",
      content: (
        <img
          src="/3.png"
          alt="Extract Frame"
          className="w-full h-full object-cover"
        />
      ),
    },
    {
      title: "Remove/Blur Background",
      description:
        "Elevate your highlight—let our AI smartly remove or blur distractions for a clean, professional look.",
      content: (
        <img
          src="/4.png"
          alt="Remove/Blur Background"
          className="w-full h-full object-cover"
        />
      ),
    },
    {
      title: "Customize",
      description:
        "Finish with flair. Add custom backgrounds, text overlays, and even get caption suggestions from GenAI before sharing your masterpiece.",
      content: (
        <img
          src="/5.png"
          alt="Customize & Share"
          className="w-full h-full object-cover"
        />
      ),
    },
    {
      title: "Share",
      description:
        "Spread your passion by showcasing your epic fan moment on social media and watch the applause roll in.",
      content: (
        <img
          src="/6.png"
          alt="Share your fan moment"
          className="w-full h-full object-cover"
        />
      ),
    },
    {
      title: "Halla Bol!",
      description:
        "Show them how big a fan you are. Share your masterpiece with the world and let the cheers roll in.",
      content: (
        <img
          src="/5.png"
          alt="Halla Bol!"
          className="w-full h-full object-cover"
        />
      ),
    },
  ];

  return (
    <section className="w-full py-12 bg-pink-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-trajan font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
          Step-by-Step: Game On!
        </h2>
        <StickyScroll content={content} />
      </div>
      <div className="pt-10 text-center">
        <button
          className="shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-pink-800 hover:text-white dark:text-neutral-200 transition duration-200"
          onClick={() => navigate("/app")}
        >
          Try Out Now
        </button>
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
    </section>
  );
};

export default ProcessOverview;
