import { createFileRoute } from "@tanstack/react-router";
import MahaJarvisUI from "@/components/MahaJarvisUI";

export const Route = createFileRoute("/hud")({
  head: () => ({
    meta: [
      { title: "HUD — Maha" },
      { name: "description", content: "Jarvis-style HUD view for Maha." },
      { property: "og:title", content: "HUD — Maha" },
      { property: "og:description", content: "Jarvis-style HUD view for Maha." },
    ],
  }),
  component: MahaJarvisUI,
});
