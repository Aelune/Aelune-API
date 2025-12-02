const ASCII_CHARS = [' ', "'", ':', 'i', 'I', 'J', '$'];

const BRIGHTNESS_LEVELS = [51, 102, 140, 170, 200, 210, 255];

const DEFAULT_SETTINGS = {
  fontSize: 8,
  charSpacing: -5,
  outputHeight: 700
};

async function encodeImageToAscii(imageUrl, settings = DEFAULT_SETTINGS) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const ascii = processImage(img, settings);
        resolve(ascii);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

function processImage(img, settings) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const aspectRatio = img.width / img.height;
  canvas.height = settings.outputHeight;
  canvas.width = canvas.height * aspectRatio;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let ascii = '';
  const charWidth = settings.fontSize;
  const charHeight = settings.fontSize;

  for (let y = 0; y < canvas.height; y += charHeight) {
    for (let x = 0; x < canvas.width; x += charWidth) {
      const brightness = getAverageBrightness(pixels, x, y, charWidth, charHeight, canvas.width);
      const char = brightnessToChar(brightness);
      ascii += char;
    }
    ascii += '\n';
  }

  return ascii;
}

function getAverageBrightness(pixels, x, y, width, height, canvasWidth) {
  let total = 0;
  let count = 0;

  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const i = ((y + dy) * canvasWidth + (x + dx)) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const brightness = (r + g + b) / 3;
      total += brightness;
      count++;
    }
  }

  return total / count;
}

function brightnessToChar(brightness) {
  for (let i = 0; i < BRIGHTNESS_LEVELS.length; i++) {
    if (brightness < BRIGHTNESS_LEVELS[i]) {
      return ASCII_CHARS[i];
    }
  }
  return ASCII_CHARS[ASCII_CHARS.length - 1];
}

async function example(imageUrl) {
  try {
    console.log('Encoding image to ASCII...');
    const ascii = await encodeImageToAscii(imageUrl);
    console.log('ASCII art generated:');
    console.log(ascii);
    return ascii;
  } catch (error) {
    console.error('Failed to encode image:', error);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    encodeImageToAscii,
    ASCII_CHARS,
    BRIGHTNESS_LEVELS,
    DEFAULT_SETTINGS
  };
}
