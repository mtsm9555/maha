import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

export const chatWithMaha = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./gate.server");
    await requireUnlocked();
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

    const systemPrompt = {
      role: "system" as const,
      content:
        "You are Maha, a friendly and concise productivity assistant. Help the user organize their tasks, plan their day, and think through problems. Keep answers short and actionable.",
    };

    const model = process.env.OPENROUTER_MODEL || "x-ai/grok-4-fast:free";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Maha",
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...data.messages],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) throw new Error("Rate limit hit. Try again in a moment.");
      if (response.status === 402)
        throw new Error("AI credits exhausted. Add credits in Lovable Cloud settings.");
      throw new Error(`AI request failed: ${text}`);
    }

    const json = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    return { reply: json.choices[0]?.message.content ?? "" };
  });
