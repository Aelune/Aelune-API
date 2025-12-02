const AELUNE_API_URL = 'https://aelune.onrender.com';

async function generateAndEncode(prompt) {
  console.log('=== AELUNE WORKFLOW ===');
  console.log('Prompt:', prompt);
  console.log('');

  try {
    console.log('[1/3] Starting image generation...');
    const generateResponse = await fetch(`${AELUNE_API_URL}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        variations: 1
      })
    });

    const generateData = await generateResponse.json();
    console.log('✓ Job ID:', generateData.jobId);
    console.log('  Estimated time:', generateData.estimatedTime);
    console.log('');

    console.log('[2/3] Waiting for generation...');
    const imageUrl = await pollStatus(generateData.jobId);
    console.log('✓ Image ready:', imageUrl);
    console.log('');

    console.log('[3/3] Ready for ASCII encoding');
    console.log('  You can now use the ASCII encoder module');
    console.log('  or the web interface to encode this image');
    console.log('');

    console.log('=== WORKFLOW COMPLETE ===');
    return {
      jobId: generateData.jobId,
      imageUrl: imageUrl,
      prompt: prompt
    };

  } catch (error) {
    console.error('❌ Workflow failed:', error.message);
    throw error;
  }
}

async function pollStatus(jobId, maxAttempts = 60) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${AELUNE_API_URL}/api/image-status/${jobId}`);
    const data = await response.json();

    if (data.status === 'succeeded') {
      return data.images[0];
    }

    if (data.status === 'failed') {
      throw new Error('Generation failed');
    }

    attempts++;
    console.log(`  Polling... (${attempts}/${maxAttempts})`);
    await sleep(2000);
  }

  throw new Error('Timeout waiting for generation');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const EXAMPLE_PROMPTS = [
  'a cyberpunk city at night with neon lights',
  'majestic mountain landscape at sunset',
  'futuristic robot in a workshop',
  'abstract geometric patterns in black and white',
  'peaceful zen garden with cherry blossoms'
];

async function runExample() {
  const prompt = EXAMPLE_PROMPTS[0];
  const result = await generateAndEncode(prompt);
  console.log('Result:', result);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateAndEncode,
    EXAMPLE_PROMPTS
  };
}
