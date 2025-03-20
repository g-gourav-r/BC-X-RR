import React, { useEffect, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

const BackgroundRemoval = ({ image, onRecapture }) => {
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      const processImage = async () => {
        setLoading(true);
        try {
          const config = {}; // Optional configuration
          const blob = await removeBackground(image, config);
          const url = URL.createObjectURL(blob);
          setProcessedImage(url);
        } catch (error) {
          console.error("Error processing image:", error);
        } finally {
          setLoading(false);
        }
      };

      processImage();
    }
  }, [image]);

  return (
    <div className="w-full flex flex-col items-center py-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Background Removal</h2>
      {loading && <p>Processing...</p>}
      {processedImage && (
        <img
          src={processedImage}
          alt="Background Removed"
          className="w-full max-w-4xl rounded-md shadow-lg"
        />
      )}
      <div className="flex space-x-4">
        <button
          onClick={onRecapture}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
        >
          Recapture
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
          // Proceed action can be implemented here later
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default BackgroundRemoval;
