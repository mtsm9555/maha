import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  tool: z.enum(["hermes", "picoclaw", "nemotron-ocr", "nvidia-build", "n8n"]),
  input: z.string(),
});

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not configured`);
  return v;
}

async function runHermes(prompt: string): Promise<string> {
  const key = requireEnv("HERMES_API_KEY");
  const res = await fetch("https://hermes-agent.nousresearch.com/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ prompt, max_tokens: 500, temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`Hermes HTTP ${res.status}`);
  const data = (await res.json()) as { text?: string; response?: string };
  return data.text || data.response || "";
}

async function runPicoclaw(command: string): Promise<unknown> {
  const key = requireEnv("PICOCLAW_API_KEY");
  const res = await fetch("https://api.picoclaw.io/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ command }),
  });
  if (!res.ok) throw new Error(`Picoclaw HTTP ${res.status}`);
  return res.json();
}

async function runNemotronOcr(imageUrl: string): Promise<string> {
  const key = requireEnv("NEMOTRON_OCR_API_KEY");
  const res = await fetch("https://api.nvidia.com/nim/nemotron-ocr/v2/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) throw new Error(`Nemotron OCR HTTP ${res.status}`);
  const data = (await res.json()) as { text?: string };
  return data.text ?? "";
}

async function runNvidiaBuild(raw: string): Promise<unknown> {
  const key = requireEnv("NVIDIA_BUILD_API_KEY");
  let skill = "default";
  let payload: unknown = raw;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const obj = parsed as { skill?: string; input?: unknown };
      skill = obj.skill ?? skill;
      payload = obj.input ?? parsed;
    }
  } catch {
    /* plain string */
  }
  const res = await fetch("https://build.nvidia.com/api/skills/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ skill_name: skill, input: payload }),
  });
  if (!res.ok) throw new Error(`NVIDIA Build HTTP ${res.status}`);
  return res.json();
}

async function runN8N(raw: string): Promise<unknown> {
  const base = requireEnv("N8N_WEBHOOK_BASE_URL");
  const key = process.env.N8N_API_KEY;
  let workflowId = raw.trim();
  let payload: unknown = {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const obj = parsed as { workflowId?: string; payload?: unknown };
      if (obj.workflowId) workflowId = obj.workflowId;
      if (obj.payload !== undefined) payload = obj.payload;
    }
  } catch {
    /* raw = workflow id */
  }
  if (!workflowId) throw new Error("workflowId is required");
  const res = await fetch(`${base.replace(/\/$/, "")}/${workflowId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "X-API-KEY": key } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`n8n HTTP ${res.status}`);
  return res.json();
}

export const runTool = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ output: string }> => {
    const toText = (v: unknown) =>
      typeof v === "string" ? v : JSON.stringify(v, null, 2);
    switch (data.tool) {
      case "hermes":
        return { output: await runHermes(data.input) };
      case "picoclaw":
        return { output: toText(await runPicoclaw(data.input)) };
      case "nemotron-ocr":
        return { output: await runNemotronOcr(data.input) };
      case "nvidia-build":
        return { output: toText(await runNvidiaBuild(data.input)) };
      case "n8n":
        return { output: toText(await runN8N(data.input)) };
    }
  });
