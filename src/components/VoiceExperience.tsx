"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceExperienceProps {
  onComplete: () => void;
}

interface ConversationLine {
  speaker: "assistant" | "user";
  text: string;
  delay: number; // ms from start of step
}

const voiceConversation: ConversationLine[] = [
  { speaker: "assistant", text: "Hi! I'm your When & Where voice assistant. Tell me about the meal you're planning.", delay: 0 },
  { speaker: "user", text: "I'm planning a birthday dinner for my friend next weekend.", delay: 3500 },
  { speaker: "assistant", text: "A birthday dinner — how fun! Which city are you in?", delay: 6000 },
  { speaker: "user", text: "We're in New York.", delay: 8500 },
  { speaker: "assistant", text: "Great! Any neighborhood preference in New York?", delay: 10500 },
  { speaker: "user", text: "Somewhere in the West Village or SoHo would be perfect.", delay: 13000 },
  { speaker: "assistant", text: "Love those areas. What cuisine are you thinking?", delay: 15500 },
  { speaker: "user", text: "Italian or Japanese — we're open to either.", delay: 18000 },
  { speaker: "assistant", text: "And what's the vibe? Trendy, cozy, romantic?", delay: 20500 },
  { speaker: "user", text: "Trendy but not too loud — we want to be able to talk.", delay: 23000 },
  { speaker: "assistant", text: "Budget-wise, where are you thinking?", delay: 25500 },
  { speaker: "user", text: "Moderate to upscale. It's a birthday so we can splurge a little.", delay: 28000 },
  { speaker: "assistant", text: "Any dietary restrictions in the group?", delay: 31000 },
  { speaker: "user", text: "One person is gluten-free.", delay: 33000 },
  { speaker: "assistant", text: "Got it! I'll send a quick poll to your friends to find the best time and match a restaurant. You'll hear back soon!", delay: 35000 },
];

function WaveformBars({ isActive, isSpeaking }: { isActive: boolean; isSpeaking: boolean }) {
  const barCount = 32;
  return (
    <div className="flex items-center justify-center gap-[2px] h-16">
      {Array.from({ length: barCount }).map((_, i) => {
        const maxHeight = isSpeaking ? 40 + Math.sin(i * 0.5) * 20 : 12;
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-[var(--color-coral)]"
            animate={{
              height: isActive ? maxHeight * (0.3 + Math.random() * 0.7) : 4,
              opacity: isActive ? 0.6 + Math.random() * 0.4 : 0.2,
            }}
            transition={{
              duration: 0.15 + Math.random() * 0.15,
              repeat: isActive ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </div>
  );
}

function VoiceOrb({ isActive, isListening }: { isActive: boolean; isListening: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute h-40 w-40 rounded-full bg-[var(--color-coral)]/5"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute h-32 w-32 rounded-full bg-[var(--color-coral)]/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
      {/* Main orb */}
      <motion.div
        className={`relative h-24 w-24 rounded-full flex items-center justify-center ${
          isActive ? "bg-[var(--color-coral)]" : "bg-[var(--color-muted)]"
        }`}
        animate={
          isActive
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(224, 122, 95, 0.3)",
                  "0 0 40px rgba(224, 122, 95, 0.5)",
                  "0 0 20px rgba(224, 122, 95, 0.3)",
                ],
              }
            : { scale: 1 }
        }
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
      >
        {isListening ? (
          <Mic className="h-10 w-10 text-white" />
        ) : isActive ? (
          <motion.div
            className="flex gap-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-3 w-1 rounded-full bg-white"
                animate={{ scaleY: [1, 2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        ) : (
          <MicOff className="h-10 w-10 text-[var(--color-muted-foreground)]" />
        )}
      </motion.div>
    </div>
  );
}

export default function VoiceExperience({ onComplete }: VoiceExperienceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<"assistant" | "user" | null>(null);
  const [isDone, setIsDone] = useState(false);

  const startDemo = useCallback(() => {
    setIsPlaying(true);
    setVisibleLines(0);
    setIsDone(false);

    voiceConversation.forEach((line, i) => {
      setTimeout(() => {
        setCurrentSpeaker(line.speaker);
        setVisibleLines(i + 1);
        if (i === voiceConversation.length - 1) {
          setTimeout(() => {
            setCurrentSpeaker(null);
            setIsPlaying(false);
            setIsDone(true);
          }, 3000);
        }
      }, line.delay);
    });
  }, []);

  // Auto-start after a brief pause
  useEffect(() => {
    const timer = setTimeout(startDemo, 1500);
    return () => clearTimeout(timer);
  }, [startDemo]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-[var(--color-charcoal)]">When & Where Voice</h2>
          <p className="text-xs text-[var(--color-muted-foreground)]">Watch a simulation of the voice experience</p>
        </div>

        <Card className="flex h-[500px] flex-col shadow-sm overflow-hidden">
          {/* Voice orb section */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-gradient-to-b from-[var(--color-muted)]/50 to-transparent">
            <VoiceOrb
              isActive={isPlaying}
              isListening={currentSpeaker === "user"}
            />
            <AnimatePresence mode="wait">
              {currentSpeaker && (
                <motion.p
                  key={currentSpeaker}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium text-[var(--color-muted-foreground)]"
                >
                  {currentSpeaker === "assistant" ? "Assistant is speaking..." : "Listening to you..."}
                </motion.p>
              )}
              {!isPlaying && !isDone && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-[var(--color-muted-foreground)]"
                >
                  Starting demo...
                </motion.p>
              )}
            </AnimatePresence>

            {/* Waveform */}
            <WaveformBars isActive={isPlaying} isSpeaking={currentSpeaker === "assistant"} />
          </div>

          {/* Transcript */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">
              Live Transcript
            </p>
            <AnimatePresence>
              {voiceConversation.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${line.speaker === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      line.speaker === "user"
                        ? "bg-[var(--color-coral)]/10 text-[var(--color-charcoal)] rounded-br-sm"
                        : "bg-[var(--color-muted)] text-[var(--color-charcoal)] rounded-bl-sm"
                    }`}
                  >
                    <span className="text-[10px] font-medium text-[var(--color-muted-foreground)] block mb-0.5">
                      {line.speaker === "assistant" ? "Assistant" : "You"}
                    </span>
                    {line.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom controls */}
          <div className="border-t border-[var(--color-border)] p-3 space-y-2">
            {!isDone && isPlaying && (
              <p className="text-xs text-center text-[var(--color-muted-foreground)]">
                Simulation in progress — watch how the conversation flows
              </p>
            )}
            {isDone && (
              <Button
                onClick={onComplete}
                className="w-full gap-1 bg-[var(--color-sage)] hover:bg-[var(--color-sage)]/90 text-white"
              >
                Done — I&apos;ve seen enough
                <Check className="h-4 w-4" />
              </Button>
            )}
            {!isPlaying && !isDone && (
              <Button
                onClick={startDemo}
                variant="outline"
                className="w-full"
              >
                Restart Demo
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
