export const callN8N = async (
  workflowId: string,
  payload: unknown,
): Promise<unknown> => {
  const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL;
  const API_KEY = import.meta.env.VITE_N8N_API_KEY;

  if (!N8N_BASE_URL) {
    throw new Error("VITE_N8N_WEBHOOK_BASE_URL is not configured");
  }

  const response = await fetch(
    `${N8N_BASE_URL.replace(/\/$/, "")}/${workflowId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "X-API-KEY": API_KEY } : {}),
      },
      body: JSON.stringify(payload ?? {}),
    },
  );

  if (!response.ok) {
    throw new Error(`n8n HTTP ${response.status}`);
  }
  return response.json();
};
