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

const HERMES_SYSTEM_PROMPT =
  "You are Hermes, a self-improving AI agent inspired by Nous Research's Hermes Agent. " +
  "Be concise, capable, and helpful. Reason step-by-step when useful, and produce clean, actionable answers.";

async function runHermes(prompt: string): Promise<string> {
  // If a self-hosted Hermes gateway is configured, use it. Otherwise fall back
  // to Lovable AI Gateway so the tool works out of the box.
  const externalBase = process.env.HERMES_BASE_URL;
  const externalKey = process.env.HERMES_API_KEY;

  if (externalBase && externalKey) {
    const base = externalBase.replace(/\/$/, "");
    const model = process.env.HERMES_MODEL || "hermes-agent";
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${externalKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: HERMES_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Hermes HTTP ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      text?: string;
    };
    return data.choices?.[0]?.message?.content ?? data.text ?? "";
  }

  const key = requireEnv("LOVABLE_API_KEY");
  const model = process.env.HERMES_MODEL || "google/gemini-2.5-flash";
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: HERMES_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Hermes (Lovable AI) HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
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

const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";

async function runNemotronOcr(imageUrl: string): Promise<string> {
  const key = requireEnv("NEMOTRON_OCR_API_KEY");
  const model = process.env.NEMOTRON_OCR_MODEL || "nvidia/nemotron-parse-1.1";
  const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all text from this image. Return plain text only." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 2048,
    }),
  });
  if (!res.ok) throw new Error(`Nemotron OCR HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

async function runNvidiaBuild(raw: string): Promise<unknown> {
  const key = requireEnv("NVIDIA_BUILD_API_KEY");
  let model = process.env.NVIDIA_BUILD_MODEL || "meta/llama-3.3-70b-instruct";
  let prompt = raw;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const obj = parsed as { model?: string; skill?: string; input?: unknown; prompt?: string };
      if (obj.model) model = obj.model;
      if (obj.prompt) prompt = obj.prompt;
      else if (typeof obj.input === "string") prompt = obj.input;
      else if (obj.input !== undefined) prompt = JSON.stringify(obj.input);
    }
  } catch {
    /* plain string prompt */
  }
  const res = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    }),
  });
  if (!res.ok) throw new Error(`NVIDIA Build HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? data;
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let output = "";
    let status: "success" | "error" = "success";
    let message = "";
    try {
      switch (data.tool) {
        case "hermes":
          output = await runHermes(data.input);
          break;
        case "picoclaw":
          output = toText(await runPicoclaw(data.input));
          break;
        case "nemotron-ocr":
          output = await runNemotronOcr(data.input);
          break;
        case "nvidia-build":
          output = toText(await runNvidiaBuild(data.input));
          break;
        case "n8n":
          output = toText(await runN8N(data.input));
          break;
      }
      message = `[${data.tool}] input=${data.input.slice(0, 200)} → ${output.slice(0, 500)}`;
    } catch (err) {
      status = "error";
      message = `[${data.tool}] input=${data.input.slice(0, 200)} → ${
        err instanceof Error ? err.message : String(err)
      }`;
      await supabaseAdmin.from("logs").insert({ status, message });
      throw err;
    }
    await supabaseAdmin.from("logs").insert({ status, message });
    return { output };
  });
