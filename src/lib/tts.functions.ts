import { createServerFn } from "@tanstack/react-start";
import { requireUnlocked } from "./gate.server";

export const MAHA_VOICE_ID = "4tRn1lSkEn13EVTuqb0g";

export const synthesizeVoice = createServerFn({ method: "POST" })
  .inputValidator((input: { text: string; voiceId?: string }) => {
    if (!input?.text || typeof input.text !== "string") throw new Error("text required");
    return { text: input.text.slice(0, 4000), voiceId: input.voiceId || MAHA_VOICE_ID };
  })
  .handler(async ({ data }) => {
    await requireUnlocked();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${data.voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      },
    );
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`ElevenLabs TTS failed: ${res.status} ${err}`);
    }
    const buf = await res.arrayBuffer();
    const audioBase64 = Buffer.from(buf).toString("base64");
    return { audioBase64, mimeType: "audio/mpeg" };
  });
