import React, { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../cropImage"; // Ensure this file exists and exports your crop helper
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { removeBackground } from "@imgly/background-removal"; // used for background removal

const Application = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const secondScreenRef = useRef(null);

  const [capturedFrame, setCapturedFrame] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [taglineSuggestions, setTaglineSuggestions] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Customization section states
  const backgroundTemplates = [
    "/background-templates/template1.webp",
    "/background-templates/template2.webp",
    "/background-templates/template3.webp",
    "/background-templates/template4.webp",
    "/background-templates/template5.webp",
    "/background-templates/template6.webp",
  ];
  const [selectedTemplate, setSelectedTemplate] = useState(
    backgroundTemplates[0]
  );
  const [overlayText, setOverlayText] = useState("");
  const [overlayColor, setOverlayColor] = useState("#de35b1");
  const [overlaySize, setOverlaySize] = useState(32);
  const [textAlignment, setTextAlignment] = useState("center"); // "left", "center", "right"
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [textLayer, setTextLayer] = useState("front"); // "front" or "back"

  // Crop state for react-easy-crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // --- Video Player Functions ---
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
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
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
      setCapturedFrame(dataURL);
      setProcessedImage(null);
      setTaglineSuggestions(null);
      setOverlayText("");
    }
  };

  // --- Process Functions ---
  const recapture = () => {
    setCapturedFrame(null);
    setProcessedImage(null);
    setTaglineSuggestions(null);
    setShowOverlay(false);
  };

  const proceed = async () => {
    if (!capturedFrame) return;

    setProcessing(true);
    setShowOverlay(true);

    try {
      // Step 1: Remove background using @imgly/background-removal
      const config = {};
      const blob = await removeBackground(capturedFrame, config);
      const processedURL = URL.createObjectURL(blob);
      setProcessedImage(processedURL);

      // Step 2: Call ChatGPT to get tagline suggestions
      const prompt = `You are a creative tagline generator for the Rajasthan Royals cricket team.
      Based on the following truncated base64 image string (which may not reveal all details), generate a JSON array of at least 5 unique, emotionally resonant tagline suggestions.
      The taglines should evoke the team's pride, passion, and energy.
      Ensure that the output is a complete JSON array with no extra commentary or markdown.
      Image (truncated): ${capturedFrame.slice(0, 50)}...`;

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        console.error("API Error:", await response.text());
        setTaglineSuggestions(["Credits Exhausted"]);
        setOverlayText("Credits Exhausted");
        return;
      }

      // Improved JSON Parsing with safer fallback logic
      const data = await response.json();
      console.log("OpenAI Response:", data);
      let suggestions;
      try {
        const rawContent = data.choices[0].message.content.trim();

        console.log("Raw content:", rawContent);
        // If the content is wrapped in triple backticks, remove them.
        let cleaned;
        if (rawContent.startsWith("```json")) {
          cleaned = rawContent
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else {
          cleaned = rawContent;
        }
        suggestions = JSON.parse(cleaned);
      } catch (e) {
        console.error(
          "Failed to parse suggestions",
          e,
          "Raw content:",
          data.choices[0].message.content
        );
        suggestions = ["Unexpected response format"];
      }

      // Ensure valid suggestions are displayed
      if (suggestions && suggestions.length > 0) {
        setTaglineSuggestions(suggestions);
        setOverlayText(suggestions[0]);
      } else {
        setTaglineSuggestions(["No suggestions available."]);
      }
    } catch (error) {
      console.error("Error during processing:", error);
      setTaglineSuggestions(["An unexpected error occurred."]);
    } finally {
      setProcessing(false);
      setTimeout(() => {
        setShowOverlay(false);
      }, 2000);
    }
  };

  const handleTaglineClick = (tagline) => {
    setOverlayText(tagline);
  };

  // --- Crop Functions ---
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCrop = () => {
    setShowCropper(true);
  };

  const cropImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        processedImage,
        croppedAreaPixels
      );
      setProcessedImage(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  // --- Share Functions ---
  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent("Check out my composition!");
    const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Composition",
          text: "Check out my composition!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web share is not supported in your browser.");
    }
  };

  // --- Download Composition Function ---
  const downloadComposition = async () => {
    // Define the dimensions of your final composition
    const compWidth = 800; // adjust as needed
    const compHeight = 600; // adjust as needed
    const compCanvas = document.createElement("canvas");
    compCanvas.width = compWidth;
    compCanvas.height = compHeight;
    const ctx = compCanvas.getContext("2d");

    // Helper function to load an image
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    try {
      const backgroundImg = await loadImage(selectedTemplate);
      const processedImg = await loadImage(processedImage);

      // Draw background template
      ctx.drawImage(backgroundImg, 0, 0, compWidth, compHeight);

      if (textLayer === "back") {
        // Draw overlay text first
        ctx.font = `${overlaySize}px font-trajan, serif`;
        ctx.fillStyle = overlayColor;
        let x;
        if (textAlignment === "center") {
          x = compWidth / 2 + horizontalOffset;
          ctx.textAlign = "center";
        } else if (textAlignment === "left") {
          x = horizontalOffset;
          ctx.textAlign = "left";
        } else {
          x = compWidth - horizontalOffset;
          ctx.textAlign = "right";
        }
        const y = compHeight / 2 + verticalOffset;
        ctx.fillText(overlayText, x, y);
        // Then draw processed image on top
        ctx.drawImage(processedImg, 0, 0, compWidth, compHeight);
      } else {
        // Draw processed image first
        ctx.drawImage(processedImg, 0, 0, compWidth, compHeight);
        ctx.font = `${overlaySize}px font-trajan, serif`;
        ctx.fillStyle = overlayColor;
        let x;
        if (textAlignment === "center") {
          x = compWidth / 2 + horizontalOffset;
          ctx.textAlign = "center";
        } else if (textAlignment === "left") {
          x = horizontalOffset;
          ctx.textAlign = "left";
        } else {
          x = compWidth - horizontalOffset;
          ctx.textAlign = "right";
        }
        const y = compHeight / 2 + verticalOffset;
        ctx.fillText(overlayText, x, y);
      }

      const dataURL = compCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "composition.png";
      link.click();
    } catch (error) {
      console.error("Error downloading composition:", error);
    }
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* --- Screen One: Video Player --- */}
      <div className="h-screen snap-start flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-pink-900 relative">
        <div className="w-full max-w-4xl bg-black border-4 shadow-lg overflow-hidden">
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
        <div className="w-full max-w-4xl pt-5 flex flex-col items-between space-y-4 border bg-black p-5">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full"
          />
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
            <button
              onClick={captureFrame}
              className="ms-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              Capture Moment
            </button>
          </div>
        </div>
        {capturedFrame && (
          <div
            className="flex flex-col items-center mt-8 cursor-pointer"
            onClick={() =>
              secondScreenRef.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            <p className="text-sm text-gray-300 mb-2">Scroll to Continue</p>
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
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* --- Screen Two: Captured Image, Background Removal, Customization, Sharing & Cropping --- */}
      <div
        className="snap-start flex flex-col items-center justify-center  bg-gradient-to-b to-blue-900 from-pink-900 relative"
        ref={secondScreenRef}
      >
        {capturedFrame && (
          <>
            <h3 className="text-6xl bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mt-5">
              Preview
            </h3>
            <div className="w-full max-w-4xl relative border-1 rounded-t shadow-lg overflow-hidden mt-25">
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Background Removed"
                  className="w-full rounded-md shadow-lg object-cover h-full"
                />
              ) : (
                <img
                  src={capturedFrame}
                  alt="Captured Frame"
                  className="w-full rounded-md shadow-lg object-cover h-full"
                />
              )}
              {showOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-out">
                  <p className="text-white text-lg font-bold">
                    {processing ? "Processing..." : "Processing complete"}
                  </p>
                </div>
              )}

              <div className="flex justify-center text-center space-x-4 mt-4 p-4 bg-slate-900 border">
                <button
                  onClick={recapture}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
                >
                  Recapture
                </button>
                <button
                  onClick={proceed}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center"
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Continue"}
                </button>
                {processedImage && (
                  <button
                    onClick={showCrop}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium flex items-center"
                  >
                    Crop Image
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {taglineSuggestions && (
          <div className="mt-6 w-full max-w-4xl bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2 font-trajan">
              Tagline Suggestions:
            </h2>
            <ul className="list-disc pl-5">
              {taglineSuggestions.map((tagline, index) => (
                <li
                  key={index}
                  className="text-gray-800 cursor-pointer hover:text-blue-600 font-trajan"
                  onClick={() => handleTaglineClick(tagline)}
                >
                  {tagline}
                </li>
              ))}
            </ul>
          </div>
        )}

        {processedImage && (
          <div className="mt-8 w-full max-w-6xl mx-auto flex flex-row space-x-4">
            {/* Left Half: Customization Controls */}
            <div className="w-1/2 bg-gray-200 p-4 rounded shadow-lg">
              <h2 className="text-xl font-trajan font-bold mb-4">
                Customize Your Composition
              </h2>
              {/* Background Template Selection */}
              <div className="mb-4">
                <h3 className="font-trajan font-bold mb-2">
                  Background Templates
                </h3>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {backgroundTemplates.map((template, index) => (
                    <img
                      key={index}
                      src={template}
                      alt={`Template ${index + 1}`}
                      className={`w-24 h-16 object-cover rounded cursor-pointer border-2 ${
                        selectedTemplate === template
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    />
                  ))}
                </div>
              </div>
              {/* Tagline Suggestions */}
              {taglineSuggestions && (
                <div className="mb-4">
                  <h3 className="font-trajan font-bold mb-2">
                    Tagline Suggestions
                  </h3>
                  <ul className="list-disc pl-5">
                    {taglineSuggestions.map((tagline, index) => (
                      <li
                        key={index}
                        className="text-gray-800 cursor-pointer hover:text-blue-600 font-trajan"
                        onClick={() => setOverlayText(tagline)}
                      >
                        {tagline}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Overlay Text Customization */}
              <div className="mb-4">
                <h3 className="font-trajan font-bold mb-2">Overlay Text</h3>
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="Enter overlay text"
                  className="w-full px-3 py-2 rounded-md border mb-2 font-trajan"
                />
                <div className="flex items-center space-x-2 mb-2">
                  <label className="font-trajan">Color:</label>
                  <input
                    type="color"
                    value={overlayColor}
                    onChange={(e) => setOverlayColor(e.target.value)}
                    className="w-10 h-10 p-0 border-0"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="font-trajan">Size:</label>
                  <input
                    type="number"
                    value={overlaySize}
                    onChange={(e) => setOverlaySize(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-md border"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="font-trajan">Alignment:</label>
                  <select
                    value={textAlignment}
                    onChange={(e) => setTextAlignment(e.target.value)}
                    className="px-2 py-1 rounded-md border font-trajan"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <label className="font-trajan">Vertical Offset (px):</label>
                  <input
                    type="number"
                    value={verticalOffset}
                    onChange={(e) => setVerticalOffset(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded-md border"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <label className="font-trajan">Horizontal Offset (px):</label>
                  <input
                    type="number"
                    value={horizontalOffset}
                    onChange={(e) =>
                      setHorizontalOffset(Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 rounded-md border"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() =>
                      setTextLayer((prev) =>
                        prev === "front" ? "back" : "front"
                      )
                    }
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-trajan"
                  >
                    {textLayer === "front"
                      ? "Send Text Behind"
                      : "Bring Text Over"}
                  </button>
                </div>
              </div>
            </div>
            {/* Right Half: Composition Preview */}
            <div className="w-1/2 bg-gray-900 p-4 rounded shadow-lg relative">
              <h2 className="text-xl font-trajan font-bold mb-4 text-white">
                Composition Preview
              </h2>
              <div
                id="composition-preview"
                className="relative w-full h-96 border rounded overflow-hidden"
              >
                {/* Background Template */}
                <img
                  src={selectedTemplate}
                  alt="Background Template"
                  className="absolute inset-0 object-cover w-full h-full"
                />
                {/* Overlay Text */}
                <div
                  className="absolute"
                  style={
                    textAlignment === "center"
                      ? {
                          top: `calc(50% + ${verticalOffset}px)`,
                          left: `calc(50% + ${horizontalOffset}px)`,
                          transform: "translate(-50%, -50%)",
                        }
                      : textAlignment === "left"
                      ? {
                          top: `calc(50% + ${verticalOffset}px)`,
                          left: `${horizontalOffset}px`,
                          transform: "translate(0, -50%)",
                        }
                      : {
                          top: `calc(50% + ${verticalOffset}px)`,
                          right: `${horizontalOffset}px`,
                          transform: "translate(0, -50%)",
                        }
                  }
                >
                  <span
                    style={{
                      color: overlayColor,
                      fontSize: `${overlaySize}px`,
                    }}
                    className="font-bold font-trajan"
                  >
                    {overlayText}
                  </span>
                </div>
                {/* Processed Image */}
                <img
                  src={processedImage}
                  alt="Foreground"
                  className="absolute inset-0 object-cover w-full h-full"
                />
              </div>
              {/* Share Section */}
              <div className="mt-6 flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-trajan"
                  >
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={handleShareInstagram}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-trajan"
                  >
                    Share on Instagram
                  </button>
                  <button
                    onClick={downloadComposition}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-trajan"
                  >
                    Download Composition
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Crop Modal Overlay --- */}
      {showCropper && processedImage && (
        <div className="absolute inset-0 z-50 bg-slate-700 bg-opacity-75 flex flex-col items-center justify-center">
          <Cropper
            image={processedImage}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={cropImage}
            className="mt-4  fixed top-1 left-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-trajan"
          >
            Done Cropping
          </button>
        </div>
      )}
    </div>
  );
};

export default Application;
