// hooks/useSpeechSynthesis.ts
import { useRef, useState } from 'react';
import { synthesizeVoice } from '@/lib/tts.functions';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const fallback = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speak = async (text: string) => {
    if (!text?.trim()) return;
    stop();
    setIsSpeaking(true);
    try {
      const { audioBase64, mimeType } = await synthesizeVoice({ data: { text } });
      const url = `data:${mimeType};base64,${audioBase64}`;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
      };
      await audio.play();
    } catch (err) {
      console.warn('ElevenLabs TTS failed, falling back to browser voice:', err);
      setIsSpeaking(false);
      fallback(text);
    }
  };

  return { isSpeaking, speak, stop };
};
