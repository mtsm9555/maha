export const callPicoclaw = async (command: string): Promise<unknown> => {
  const PICOCLAW_URL = 'https://api.picoclaw.io/execute';
  const API_KEY = import.meta.env.VITE_PICOCLAW_API_KEY;

  if (!API_KEY) {
    throw new Error('Picoclaw API key is not configured');
  }

  const response = await fetch(PICOCLAW_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ command }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
