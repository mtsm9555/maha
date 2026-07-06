// lib/hermesAgent.ts
export const callHermesAgent = async (prompt: string): Promise<string> => {
  const HERMES_AGENT_URL = 'https://hermes-agent.nousresearch.com/api/generate';
  const API_KEY = import.meta.env.VITE_HERMES_API_KEY;

  if (!API_KEY) {
    throw new Error('Hermes API key is not configured');
  }

  try {
    const response = await fetch(HERMES_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || data.response || 'I am not sure how to respond to that.';
  } catch (error) {
    console.error('Error calling Hermes Agent:', error);
    throw error;
  }
};
