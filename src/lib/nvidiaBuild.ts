export const callNvidiaBuild = async (
  skillName: string,
  input: unknown,
): Promise<unknown> => {
  const NVIDIA_BUILD_URL = 'https://build.nvidia.com/api/skills/execute';
  const API_KEY = import.meta.env.VITE_NVIDIA_BUILD_API_KEY;

  if (!API_KEY) {
    throw new Error('NVIDIA Build API key is not configured');
  }

  const response = await fetch(NVIDIA_BUILD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ skill_name: skillName, input }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
