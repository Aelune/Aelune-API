const AELUNE_API_URL = 'https://aelune.onrender.com';

async function checkStatus(jobId) {
  try {
    const response = await fetch(`${AELUNE_API_URL}/api/image-status/${jobId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
}

async function waitForCompletion(jobId, interval = 2000, maxAttempts = 60) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const status = await checkStatus(jobId);

        if (status.status === 'succeeded') {
          console.log('Generation complete!');
          resolve(status);
          return;
        }

        if (status.status === 'failed') {
          reject(new Error('Generation failed'));
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error('Polling timeout exceeded'));
          return;
        }

        console.log(`Still processing... (${attempts}/${maxAttempts})`);
        setTimeout(poll, interval);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

async function example(jobId) {
  try {
    console.log('Waiting for generation to complete...');
    const result = await waitForCompletion(jobId);

    console.log('Images ready:');
    result.images.forEach((imageUrl, index) => {
      console.log(`Image ${index + 1}: ${imageUrl}`);
    });

    return result.images;
  } catch (error) {
    console.error('Failed to retrieve images:', error);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkStatus, waitForCompletion };
}
