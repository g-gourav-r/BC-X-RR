import React, { useRef, useState } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { MdReplay10, MdForward10 } from "react-icons/md";

const VideoPlayerWithControls = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    const newTime = parseFloat(e.target.value);
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(
        Math.max(video.currentTime + seconds, 0),
        duration
      );
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      // Pass the captured frame (base64 URL) to the parent
      onCapture(dataURL);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 space-y-6">
      {/* TV-like Video Container */}
      <div className="w-full max-w-4xl bg-black border-4 border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full"
          controls={false}
          src="/static-video.mp4"
          type="video/mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Controls Below Video */}
      <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full"
        />

        {/* Button Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => skipTime(-10)}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
            title="Rewind 10 seconds"
          >
            <MdReplay10 size={24} />
          </button>
          <button
            onClick={() => skipTime(-1)}
            className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
            title="Rewind 1 second"
          >
            <FaStepBackward size={20} />
            <span className="text-xs ml-1">1s</span>
          </button>
          <button
            onClick={togglePlayPause}
            className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
            title="Play / Pause"
          >
            {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
          </button>
          <button
            onClick={() => skipTime(1)}
            className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
            title="Forward 1 second"
          >
            <FaStepForward size={20} />
            <span className="text-xs ml-1">1s</span>
          </button>
          <button
            onClick={() => skipTime(10)}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
            title="Forward 10 seconds"
          >
            <MdForward10 size={24} />
          </button>
        </div>

        {/* Capture Moment Button */}
        <button
          onClick={captureFrame}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
        >
          Capture Moment
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VideoPlayerWithControls;
