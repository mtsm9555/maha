import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./gate.server";

export const synthesizeVoice = createServerFn({ method: "POST" })
  .inputValidator((input: { text: string }) => {
    if (!input?.text || typeof input.text !== "string") throw new Error("text required");
    return { text: input.text.slice(0, 4000) };
  })
  .handler(async ({ data }) => {
    await requireUnlocked();
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Voice service is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: data.text,
        voice: "alloy",
        instructions: "Speak as Maha: clear, calm, warm, focused, and professional. Avoid flirtatious or exaggerated delivery.",
        stream_format: "audio",
        response_format: "mp3",
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Voice synthesis failed: ${res.status} ${err}`);
    }

    const buf = await res.arrayBuffer();
    const audioBase64 = Buffer.from(buf).toString("base64");
    return { audioBase64, mimeType: "audio/mpeg" };
  });
