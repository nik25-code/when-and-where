"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Send } from "lucide-react";

interface ChatbotExperienceProps {
  onComplete: () => void;
}

interface Message {
  role: "bot" | "user";
  text: string;
}

interface ChatStep {
  botMessage: string;
  quickReplies?: string[];
  freeInput?: boolean;
  inputPlaceholder?: string;
}

const chatFlow: ChatStep[] = [
  {
    botMessage: "Hey! I'm your When & Where assistant. I'll help you plan the perfect meal with friends. What's the occasion?",
    quickReplies: ["Birthday dinner", "Casual catch-up", "Date night", "Work celebration"],
    freeInput: true,
    inputPlaceholder: "Or type your own...",
  },
  {
    botMessage: "Love it! What kind of meal are you thinking?",
    quickReplies: ["Breakfast", "Brunch", "Lunch", "Dinner", "Drinks"],
  },
  {
    botMessage: "Great choice! Which city are you planning this in?",
    quickReplies: ["New York", "Los Angeles", "San Francisco", "Chicago"],
    freeInput: true,
    inputPlaceholder: "Type a city...",
  },
  {
    botMessage: "Got it! Any particular neighborhood you'd prefer?",
    quickReplies: ["No preference", "Downtown", "Midtown", "Uptown"],
    freeInput: true,
    inputPlaceholder: "Type a neighborhood...",
  },
  {
    botMessage: "What kind of food are you craving? You can pick a few!",
    quickReplies: ["Italian", "Japanese", "Mexican", "Thai", "No preference"],
  },
  {
    botMessage: "What vibe are you going for?",
    quickReplies: ["Casual & chill", "Trendy & cool", "Romantic", "Cozy", "No preference"],
  },
  {
    botMessage: "And what's your budget looking like?",
    quickReplies: ["Budget friendly $", "Moderate $$", "Upscale $$$", "Fine dining $$$$", "No preference"],
  },
  {
    botMessage: "Any dietary restrictions I should know about?",
    quickReplies: ["None", "Vegetarian", "Vegan", "Gluten-free"],
    freeInput: true,
    inputPlaceholder: "Type restrictions...",
  },
  {
    botMessage: "Any specific restaurants you've been wanting to try?",
    quickReplies: ["No, surprise me!", "Yes, let me type one"],
    freeInput: true,
    inputPlaceholder: "Restaurant name...",
  },
  {
    botMessage: "Awesome, that's everything I need! Now I'd normally ask your friends the same questions and find the perfect match. How did this experience feel?",
    quickReplies: ["Easy & natural", "Pretty good", "Took too long", "Prefer something else"],
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="typing-dot h-2 w-2 rounded-full bg-[var(--color-muted-foreground)]" />
      <div className="typing-dot h-2 w-2 rounded-full bg-[var(--color-muted-foreground)]" />
      <div className="typing-dot h-2 w-2 rounded-full bg-[var(--color-muted-foreground)]" />
    </div>
  );
}

export default function ChatbotExperience({ onComplete }: ChatbotExperienceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Show initial bot message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{ role: "bot", text: chatFlow[0].botMessage }]);
      setIsTyping(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleUserReply = (text: string) => {
    if (isTyping) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInputValue("");

    const nextStep = currentStep + 1;

    if (nextStep >= chatFlow.length) {
      setIsComplete(true);
      return;
    }

    // Show typing indicator then bot reply
    setIsTyping(true);
    setCurrentStep(nextStep);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: chatFlow[nextStep].botMessage },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      handleUserReply(inputValue.trim());
    }
  };

  const currentQuickReplies = !isTyping && !isComplete ? chatFlow[currentStep]?.quickReplies : undefined;
  const showFreeInput = !isTyping && !isComplete && chatFlow[currentStep]?.freeInput;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-[var(--color-charcoal)]">When & Where Chat</h2>
          <p className="text-xs text-[var(--color-muted-foreground)]">Plan your meal through conversation</p>
        </div>

        <Card className="flex h-[500px] flex-col shadow-sm">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-[var(--color-coral)] text-white rounded-br-sm"
                      : "bg-[var(--color-muted)] text-[var(--color-charcoal)] rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-[var(--color-muted)]">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {currentQuickReplies && (
            <div className="border-t border-[var(--color-border)] px-3 py-2">
              <div className="flex flex-wrap gap-1.5">
                {currentQuickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleUserReply(reply)}
                    className="rounded-full bg-white border border-[var(--color-coral)] px-3 py-1.5 text-xs font-medium text-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Free input */}
          {showFreeInput && (
            <div className="border-t border-[var(--color-border)] p-3">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={chatFlow[currentStep]?.inputPlaceholder || "Type a message..."}
                  onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleInputSubmit}
                  disabled={!inputValue.trim()}
                  className="bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90 text-white px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* If no free input but not complete, show just the quick replies input area  */}
          {!showFreeInput && !isComplete && !isTyping && (
            <div className="border-t border-[var(--color-border)] p-3">
              <p className="text-xs text-center text-[var(--color-muted-foreground)]">Tap a response above</p>
            </div>
          )}

          {/* Complete state */}
          {isComplete && (
            <div className="border-t border-[var(--color-border)] p-3">
              <Button
                onClick={onComplete}
                className="w-full gap-1 bg-[var(--color-sage)] hover:bg-[var(--color-sage)]/90 text-white"
              >
                Done — I&apos;ve seen enough
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
