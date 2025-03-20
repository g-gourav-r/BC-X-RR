// cropImage.js
export default async function getCroppedImg(imageSrc, pixelCrop) {
  // Create an image element
  const image = new Image();
  image.src = imageSrc;
  // Ensure the image is loaded
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  // Create a canvas with the desired dimensions
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert the canvas to a data URL (you can also return a blob if preferred)
  return canvas.toDataURL("image/png");
}
