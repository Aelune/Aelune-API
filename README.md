# Aelune API Documentation

Transform reality into encoded art. Generate images with AI and convert them to ASCII masterpieces.

## Base URL

```
https://aelune.onrender.com
```

## Quick Start

### Using the API Directly

You can use the API from any environment that supports HTTP requests:

```bash
curl -X POST https://aelune.onrender.com/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a cyberpunk city at night", "variations": 1}'
```

### Using Example Modules (Local Development)

This repository includes example JavaScript modules for easy integration:

```bash
# Navigate to the api directory
cd api

# Use the provided examples
node full-example.js
```

**Available modules:**
- `generate-image.js` - Image generation helper
- `check-status.js` - Status polling and completion waiting
- `ascii-encoder.js` - Client-side ASCII encoding
- `full-example.js` - Complete workflow example

## Endpoints

### Generate Image

Generate AI images from text prompts using Google's Imagen-4 model.

**Endpoint:** `POST /api/generate-image`

**Request Body:**
```json
{
  "prompt": "your image description here",
  "variations": 1
}
```

**Parameters:**
- `prompt` (string, required): Text description of the image to generate
- `variations` (number, optional): Number of image variations to create. Default: 1

**Response:**
```json
{
  "success": true,
  "jobId": "unique-job-identifier",
  "estimatedTime": "30-60 seconds"
}
```

**Example:**
```javascript
const response = await fetch('https://aelune.onrender.com/api/generate-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'a cyberpunk city at night with neon lights',
    variations: 1
  })
});

const data = await response.json();
console.log(data.jobId); // Use this to check status
```

---

### Check Generation Status

Poll the status of your image generation job.

**Endpoint:** `GET /api/image-status/:jobId`

**Parameters:**
- `jobId` (string, required): The job ID returned from generate-image endpoint

**Response (Processing):**
```json
{
  "status": "processing"
}
```

**Response (Success):**
```json
{
  "status": "succeeded",
  "images": [
    "https://replicate.delivery/pbxt/image-url.png"
  ]
}
```

**Response (Failed):**
```json
{
  "status": "failed"
}
```

**Example:**
```javascript
const checkStatus = async (jobId) => {
  const response = await fetch(`https://aelune.onrender.com/api/image-status/${jobId}`);
  const data = await response.json();

  if (data.status === 'succeeded') {
    console.log('Image ready:', data.images[0]);
  } else if (data.status === 'processing') {
    console.log('Still generating...');
    setTimeout(() => checkStatus(jobId), 2000); // Check again in 2s
  }
};
```

---

### Get Media File

Retrieve generated media files by ID.

**Endpoint:** `GET /api/media/:fileId`

**Parameters:**
- `fileId` (string, required): The media file identifier

**Response:**
Returns the media file with appropriate content-type headers.

---

## Image Specifications

- **Aspect Ratio:** 16:9 (widescreen)
- **Model:** Advanced AI Image Generation
- **Output Format:** PNG
- **Generation Time:** Approximately 30-60 seconds

---

## Local Development

### Setting Up Local Environment

1. **Clone the repository:**
```bash
git clone https://github.com/Aelune/Aelune-API.git
cd Aelune-API
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
Create a `.env` file in the root directory:
```env
BACKEND_URL=https://aelune.onrender.com
# Add your API tokens here if self-hosting
```

4. **Run the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Using the API Modules

**Example: Generate and retrieve an image**

```javascript
// Import the modules
const { generateImage } = require('./api/generate-image.js');
const { waitForCompletion } = require('./api/check-status.js');

async function main() {
  // Generate image
  const job = await generateImage('a peaceful zen garden');
  console.log('Job started:', job.jobId);

  // Wait for completion
  const result = await waitForCompletion(job.jobId);
  console.log('Image URL:', result.images[0]);
}

main();
```

**Example: Full workflow with ASCII encoding**

```javascript
const { generateAndEncode } = require('./api/full-example.js');

// Generate image and get URL for encoding
generateAndEncode('cyberpunk city at night')
  .then(result => {
    console.log('Ready for ASCII encoding!');
    console.log('Image URL:', result.imageUrl);
  });
```

### Testing the API

**Test image generation:**
```bash
curl -X POST https://aelune.onrender.com/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "test image generation",
    "variations": 1
  }'
```

**Test status checking:**
```bash
curl https://aelune.onrender.com/api/image-status/YOUR_JOB_ID
```

---

## ASCII Encoder

The Aelune encoder transforms images into monochrome ASCII art using character density mapping.

### Encoding Settings

**Font Size:**
- Image mode: 5-20px (default: 8px)
- Video mode: 10-20px (default: 11px)

**Character Spacing:**
- Range: -10 to 0px (default: -5px)
- Negative values create denser output

**Output Resolution:**
- Images: 700px height, aspect-ratio preserved
- Videos: 1080px height (Full HD)

### Character Map

The encoder uses 7 characters representing brightness levels:

```
' '  → Space (darkest, 0-51 brightness)
"'"  → Apostrophe (51-102)
':'  → Colon (102-140)
'i'  → Lowercase i (140-170)
'I'  → Uppercase I (170-200)
'J'  → Uppercase J (200-210)
'$'  → Dollar sign (brightest, 210-255)
```

### Video Encoding

- **Recording FPS:** 120 (ultra-smooth playback)
- **Output Format:** WebM
- **Bitrate:** 25 Mbps (maximum quality)
- **Codec:** VP9 (fallback to VP8/WebM)

---

## Rate Limits

The API uses a token-based queue system to manage rate limits across multiple Replicate API keys. Requests are automatically queued and processed as tokens become available.

---

## Links

- **Website:** [aelune.xyz](https://aelune.xyz)
- **X/Twitter:** [@AeluneTech](https://x.com/AeluneTech)
- **GitHub:** [Aelune/Aelune-API](https://github.com/Aelune/Aelune-API)

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found (invalid jobId or fileId)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

*The grid is eternal. The truth is monochrome. The transformation starts now.*
