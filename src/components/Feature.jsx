import React from "react";
import { IconContainer } from "./ui/IconContainer";
import { Radar } from "./ui/Radar";
import { Compare } from "./ui/compare";
import { Cover } from "./ui/cover";

const Feature = () => {
  return (
    <div className=" w-full relative overflow-hidden bg-gradient-to-b from-pink-900 to-blue-900 p-8 pt-20 pb-20">
      {/* Global Heading */}
      <div className="w-full text-center mb-8">
        <h1 className="text-4xl font-trajan font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
          Unleash the Royal Spirit
        </h1>
      </div>
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-start justify-center">
        {/* Left Side */}
        <div className="w-full md:w-1/2 px-10 py-8 flex flex-col justify-center">
          <div className="text-3xl text-center font-trajan font-semibold  mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            Elevate Your Game Captions
          </div>
          <div className="text-lg text-center font-trajan text-gray-200 mb-8">
            Let our AI craft dynamic captions that capture the perfect scene and
            energy. Choose from creative, fan-approved suggestions to amplify
            your moments.
          </div>
          <div className="relative flex h-96 mx-auto flex-col items-center justify-center space-y-4 overflow-hidden px-4">
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                <IconContainer text="Snatched from the Sky!" delay={0.2} />
                <IconContainer text="Safe Hands, Sure Victory!" delay={0.4} />
                <IconContainer
                  text="Caught in the Act – Game Changer!"
                  delay={0.3}
                />
              </div>
            </div>
            <div className="mx-auto w-full max-w-md">
              <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                <IconContainer
                  text="Hands of Steel, Heart of a Champion!"
                  delay={0.5}
                />
                <IconContainer text="One Grab, Infinite Roars!" delay={0.8} />
              </div>
            </div>
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                <IconContainer
                  text="Magic in Motion – Royals Rising!"
                  delay={0.6}
                />
                <IconContainer
                  text="Sealed with a Catch – Unstoppable Royals!"
                  delay={0.7}
                />
              </div>
            </div>
            <div className="mx-auto w-full max-w-md">
              <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                <IconContainer
                  text="When Pressure Peaks, Royals Strike!"
                  delay={0.5}
                />
                <IconContainer text="Grip Tight, Win Right!" delay={0.8} />
              </div>
            </div>
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex w-full items-center justify-center space-x-10 md:justify-between md:space-x-0">
                <IconContainer text="A Catch Worth a Crown!" delay={0.6} />
              </div>
            </div>
            <Radar className="absolute -bottom-12" />
            <div className="absolute bottom-0 z-[41] h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>
          <Cover className="text-4xl font-trajan bg-gradient-to-r from-blue-400 to-pink-600 bg-clip-text text-transparent text-center">
            Your Match, Your Moment, Your Way
          </Cover>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 px-10 py-8 flex flex-col justify-center">
          <div className="text-3xl font-trajan font-semibold text-center mb-4 bg-gradient-to-r to-pink-400 from-blue-900 bg-clip-text text-transparent">
            Capture & Share Your Passion
          </div>
          <div className="text-lg text-center font-trajan text-gray-200 mb-8">
            Transform your favorite moments into unforgettable posts. Show your
            unwavering support and celebrate every game-changing play.
          </div>
          <div className="h-full flex items-center justify-center">
            <Compare
              firstImage="/before.png"
              secondImage="/after.png"
              firstImageClassName="object-cover object-left-top"
              secondImageClassname="object-cover object-left-top"
              className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
              slideMode="hover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
