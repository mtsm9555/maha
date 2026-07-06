export const callNemotronOcr = async (imageUrl: string): Promise<string> => {
  const NEMOTRON_OCR_URL = 'https://api.nvidia.com/nim/nemotron-ocr/v2/extract';
  const API_KEY = import.meta.env.VITE_NEMOTRON_OCR_API_KEY;

  if (!API_KEY) {
    throw new Error('Nemotron OCR API key is not configured');
  }

  const response = await fetch(NEMOTRON_OCR_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
};
