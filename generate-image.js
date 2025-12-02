const AELUNE_API_URL = 'https://aelune.onrender.com';

async function generateImage(prompt, variations = 1) {
  try {
    const response = await fetch(`${AELUNE_API_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        variations: variations
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

async function example() {
  try {
    const result = await generateImage('a cyberpunk city at night with neon lights');
    console.log('Generation started:', result.jobId);
    console.log('Estimated time:', result.estimatedTime);

    return result.jobId;
  } catch (error) {
    console.error('Failed to generate image:', error);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateImage };
}
