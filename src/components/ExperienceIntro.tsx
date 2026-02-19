"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ClipboardList, MessageCircle, Mic } from "lucide-react";

type ExperienceType = "form" | "chatbot" | "voice";

interface ExperienceIntroProps {
  type: ExperienceType;
  index: number;
  total: number;
  onStart: () => void;
}

const experienceConfig: Record<
  ExperienceType,
  { icon: React.ReactNode; title: string; description: string; detail: string }
> = {
  form: {
    icon: <ClipboardList className="h-8 w-8" />,
    title: "Survey Form",
    description:
      "A step-by-step form where you fill in your dining preferences across multiple screens.",
    detail:
      "Click through the form as if you were actually planning dinner with friends. You don't need to fill in real info — just get a feel for the experience.",
  },
  chatbot: {
    icon: <MessageCircle className="h-8 w-8" />,
    title: "Chat Assistant",
    description:
      "A conversational chatbot that asks you about your dining preferences through a text conversation.",
    detail:
      "Chat naturally using the quick-reply buttons or type your own responses. Experience how it feels to plan through conversation.",
  },
  voice: {
    icon: <Mic className="h-8 w-8" />,
    title: "Voice Assistant",
    description:
      "A voice-powered assistant you'd speak to about your dining plans — like talking to Siri or Alexa.",
    detail:
      "This is a simulation of what the voice experience would feel like. Watch the demo and imagine speaking your preferences aloud.",
  },
};

export default function ExperienceIntro({
  type,
  index,
  total,
  onStart,
}: ExperienceIntroProps) {
  const config = experienceConfig[type];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <p className="text-center text-sm font-medium text-[var(--color-muted-foreground)]">
          Experience {index} of {total}
        </p>

        <Card className="p-8 space-y-6 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-coral)]/10 text-[var(--color-coral)]">
            {config.icon}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--color-charcoal)]">
              {config.title}
            </h2>
            <p className="text-[var(--color-charcoal)]">{config.description}</p>
          </div>

          <div className="rounded-lg bg-[var(--color-muted)] p-3">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {config.detail}
            </p>
          </div>

          <Button
            onClick={onStart}
            className="w-full bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90 text-white"
            size="lg"
          >
            Try This Experience
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
