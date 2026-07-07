import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { chatWithMaha } from "@/lib/chat.functions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { JarvisHud } from "@/components/JarvisHud";

type Message = { role: "user" | "assistant"; content: string };

export function Chat() {
  const call = useServerFn(chatWithMaha);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, I'm Maha. What are you working on today?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const speech = useSpeechRecognition();
  const synth = useSpeechSynthesis();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (speech.transcript) setInput(speech.transcript);
  }, [speech.transcript]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const { reply } = await call({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
      if (voiceOn) synth.speak(reply);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Chat failed");
      setMessages(messages);
    } finally {
      setPending(false);
    }
  }

  function handleVoice() {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (speech.isListening) {
      speech.stopListening();
      if (speech.transcript) sendMessage(speech.transcript);
    } else {
      speech.startListening();
    }
  }

  function toggleVoiceOut() {
    if (synth.isSpeaking) window.speechSynthesis.cancel();
    setVoiceOn((v) => !v);
  }

  return (
    <div className="flex flex-col h-full min-h-0 relative z-10">
      <JarvisHud speaking={pending || synth.isSpeaking || speech.isListening} />
      <div className="flex items-center justify-between px-4 py-3 bg-task-panel/60 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 grid place-items-center">
            <span className="absolute inset-0 rounded-full border border-primary/40 hud-spin-slow" style={{ borderStyle: "dashed" }} />
            <span className="absolute inset-1 rounded-full border border-primary/25 hud-spin-reverse" />
            <span className="h-6 w-6 rounded-full bg-primary glow-accent" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold leading-tight text-primary text-glow">M.A.H.A.</h2>
            <p className="label-mono">
              {pending ? "// processing" : synth.isSpeaking ? "// transmitting" : "// standby"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleVoiceOut}
          aria-label={voiceOn ? "Mute voice" : "Unmute voice"}
          title={voiceOn ? "Voice on" : "Voice off"}
        >
          {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`p-3 max-w-[85%] text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground border-primary" : ""
              }`}
            >
              {m.content}
            </Card>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start">
            <Card className="p-3 text-sm text-muted-foreground">Thinking…</Card>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2 px-4 py-3 bg-task-panel border-t border-border"
      >
        <Input
          placeholder={speech.isListening ? "Listening…" : "Type a message or use voice…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pending}
        />
        <Button
          type="button"
          size="icon"
          variant={speech.isListening ? "destructive" : "outline"}
          onClick={handleVoice}
          disabled={pending}
          aria-label={speech.isListening ? "Stop listening" : "Start voice input"}
          className={speech.isListening ? "animate-mic-pulse" : ""}
        >
          {speech.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button type="submit" size="icon" disabled={pending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

