const AELUNE_API_URL = 'https://aelune.onrender.com';

class AeluneAPI {
  constructor(apiUrl = AELUNE_API_URL) {
    this.apiUrl = apiUrl;
  }

  async generateImage(prompt, variations = 1) {
    const response = await fetch(`${this.apiUrl}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, variations })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  async checkStatus(jobId) {
    const response = await fetch(`${this.apiUrl}/api/image-status/${jobId}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  async waitForCompletion(jobId, interval = 2000, maxAttempts = 60) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.checkStatus(jobId);

      if (status.status === 'succeeded') {
        return status;
      }

      if (status.status === 'failed') {
        throw new Error('Generation failed');
      }

      attempts++;
      await this.sleep(interval);
    }

    throw new Error('Timeout waiting for completion');
  }

  async generateAndWait(prompt, variations = 1) {
    console.log('Generating image:', prompt);
    const job = await this.generateImage(prompt, variations);

    console.log('Job ID:', job.jobId);
    console.log('Waiting for completion...');

    const result = await this.waitForCompletion(job.jobId);
    console.log('Complete! Images:', result.images.length);

    return result.images;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

async function quickExample() {
  const api = new AeluneAPI();

  try {
    const images = await api.generateAndWait('a serene mountain landscape');
    console.log('Generated images:', images);

    return images;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AeluneAPI, AELUNE_API_URL };
}
