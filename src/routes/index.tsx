import { createFileRoute } from "@tanstack/react-router";
import MahaJarvisUI from "@/components/MahaJarvisUI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maha — HUD" },
      { name: "description", content: "Jarvis-style HUD interface for Maha." },
      { property: "og:title", content: "Maha — HUD" },
      { property: "og:description", content: "Jarvis-style HUD interface for Maha." },
    ],
  }),
  component: MahaJarvisUI,
});
