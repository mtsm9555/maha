// lib/hermesAgent.ts
export const callHermesAgent = async (prompt: string): Promise<string> => {
  // Hermes AgentのAPIエンドポイント（仮）
  const HERMES_AGENT_URL = 'https://hermes-agent.nousresearch.com/api/generate';

  try {
    const response = await fetch(HERMES_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || 'I am not sure how to respond to that.';
  } catch (error) {
    console.error('Error calling Hermes Agent:', error);
    throw error;
  }
};