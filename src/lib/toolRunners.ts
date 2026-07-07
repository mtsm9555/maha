import { callHermesAgent } from "./hermesAgent";
import { callPicoclaw } from "./picoclaw";
import { callNemotronOcr } from "./nemotronOcr";
import { callNvidiaBuild } from "./nvidiaBuild";
import { callN8N } from "./n8n";

export type ToolRunner = {
  key: string;
  label: string;
  category: string;
  inputLabel: string;
  placeholder: string;
  run: (input: string) => Promise<string>;
};

const toText = (v: unknown): string =>
  typeof v === "string" ? v : JSON.stringify(v, null, 2);

export const TOOL_RUNNERS: ToolRunner[] = [
  {
    key: "hermes",
    label: "Hermes Agent",
    category: "ai",
    inputLabel: "Prompt",
    placeholder: "Ask Hermes anything…",
    run: (input) => callHermesAgent(input),
  },
  {
    key: "picoclaw",
    label: "Picoclaw",
    category: "automation",
    inputLabel: "Command",
    placeholder: "e.g. open https://example.com",
    run: async (input) => toText(await callPicoclaw(input)),
  },
  {
    key: "nemotron-ocr",
    label: "Nemotron OCR",
    category: "vision",
    inputLabel: "Image URL",
    placeholder: "https://…/image.png",
    run: (input) => callNemotronOcr(input),
  },
  {
    key: "nvidia-build",
    label: "NVIDIA Build",
    category: "ai",
    inputLabel: "Skill / input JSON",
    placeholder: '{"skill":"summarize","input":"…"}',
    run: async (input) => {
      let skill = "default";
      let payload: unknown = input;
      try {
        const parsed = JSON.parse(input);
        if (parsed && typeof parsed === "object") {
          const obj = parsed as { skill?: string; input?: unknown };
          skill = obj.skill ?? skill;
          payload = obj.input ?? parsed;
        }
      } catch {
        // treat as plain string input
      }
      return toText(await callNvidiaBuild(skill, payload));
    },
  },
  {
    key: "n8n",
    label: "n8n Workflow",
    category: "automation",
    inputLabel: "Workflow ID + JSON payload",
    placeholder: '{"workflowId":"abc123","payload":{"foo":"bar"}}',
    run: async (input) => {
      let workflowId = input.trim();
      let payload: unknown = {};
      try {
        const parsed = JSON.parse(input);
        if (parsed && typeof parsed === "object") {
          const obj = parsed as { workflowId?: string; payload?: unknown };
          if (obj.workflowId) workflowId = obj.workflowId;
          if (obj.payload !== undefined) payload = obj.payload;
        }
      } catch {
        // treat entire input as workflow id
      }
      if (!workflowId) throw new Error("workflowId is required");
      return toText(await callN8N(workflowId, payload));
    },
  },
];

export function findRunner(name: string | null | undefined): ToolRunner | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase();
  return TOOL_RUNNERS.find(
    (r) => r.key === key || r.label.toLowerCase() === key || key.includes(r.key),
  );
}
