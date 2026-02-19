"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";

interface FollowUpSurveyProps {
  experienceOrder: ("form" | "chatbot" | "voice")[];
  onComplete: (responses: SurveyResponses) => void;
}

export interface SurveyResponses {
  interfaceRanking: string[];
  interfaceWhy: string;
  painLevel: number;
  timeMatchValue: string;
  whatMattersMore: string;
  formCompletionLikelihood: string;
  groupSize: string;
  additionalThoughts: string;
}

const interfaceLabels: Record<string, string> = {
  form: "Survey Form",
  chatbot: "Chat Assistant",
  voice: "Voice Assistant",
};

export default function FollowUpSurvey({ experienceOrder, onComplete }: FollowUpSurveyProps) {
  const [step, setStep] = useState(0);
  const [ranking, setRanking] = useState<string[]>([]);
  const [interfaceWhy, setInterfaceWhy] = useState("");
  const [painLevel, setPainLevel] = useState<number>(0);
  const [timeMatchValue, setTimeMatchValue] = useState("");
  const [whatMattersMore, setWhatMattersMore] = useState("");
  const [formCompletion, setFormCompletion] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [additionalThoughts, setAdditionalThoughts] = useState("");

  const toggleRanking = (id: string) => {
    setRanking((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleSubmit = () => {
    onComplete({
      interfaceRanking: ranking,
      interfaceWhy,
      painLevel,
      timeMatchValue,
      whatMattersMore,
      formCompletionLikelihood: formCompletion,
      groupSize,
      additionalThoughts,
    });
  };

  const steps = [
    // Step 0: Interface ranking
    <div key="ranking" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Which did you prefer?</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Tap in order of preference (1st = favorite)
        </p>
      </div>

      <div className="space-y-2">
        {experienceOrder.map((type) => {
          const position = ranking.indexOf(type);
          const isSelected = position !== -1;
          return (
            <button
              key={type}
              onClick={() => toggleRanking(type)}
              className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/5"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/30"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isSelected
                    ? "bg-[var(--color-coral)] text-white"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                }`}
              >
                {isSelected ? position + 1 : "—"}
              </div>
              <span className="font-medium text-[var(--color-charcoal)]">
                {interfaceLabels[type]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <Label>Why did you rank them this way?</Label>
        <Textarea
          placeholder="What made your top choice feel best?"
          value={interfaceWhy}
          onChange={(e) => setInterfaceWhy(e.target.value)}
          rows={3}
        />
      </div>
    </div>,

    // Step 1: Pain point & time match value
    <div key="pain" className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">The Problem</h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">Help us understand the pain point</p>
        </div>

        <div className="space-y-2">
          <Label>How painful is coordinating dining plans with friends?</Label>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPainLevel(i + 1)}
                className={`flex-1 aspect-square rounded-lg text-sm font-medium transition-all ${
                  painLevel === i + 1
                    ? "bg-[var(--color-coral)] text-white scale-110"
                    : painLevel > 0 && i + 1 <= painLevel
                    ? "bg-[var(--color-coral)]/20 text-[var(--color-coral)]"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-coral)]/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[var(--color-muted-foreground)]">
            <span>Not painful</span>
            <span>Extremely painful</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          If a tool ONLY helped find a time everyone&apos;s free (no restaurant suggestions), would that be useful?
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Yes — finding a time is the hardest part",
            "Somewhat — but I'd want restaurant help too",
            "Not really — I need the full package",
            "No — I can figure out timing on my own",
          ].map((option) => (
            <button
              key={option}
              onClick={() => setTimeMatchValue(option)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                timeMatchValue === option
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/5 font-medium"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 2: What matters more + form completion + group size
    <div key="value" className="space-y-5">
      <div className="space-y-2">
        <Label>What matters MORE when planning group meals?</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Finding a time that works for everyone",
            "Getting great restaurant recommendations",
            "Both equally",
            "Neither — I just text my friends",
          ].map((option) => (
            <button
              key={option}
              onClick={() => setWhatMattersMore(option)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                whatMattersMore === option
                  ? "border-[var(--color-sage)] bg-[var(--color-sage)]/5 font-medium"
                  : "border-[var(--color-border)] hover:border-[var(--color-sage)]/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>If a friend sent you a link to fill out a quick dining preferences form, how likely would you fill it out?</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Definitely — if it's quick",
            "Probably — depends on how long it takes",
            "Maybe — I'd need convincing",
            "Unlikely — I'd rather just text",
          ].map((option) => (
            <button
              key={option}
              onClick={() => setFormCompletion(option)}
              className={`rounded-xl border-2 px-4 py-3 text-left text-sm transition-all ${
                formCompletion === option
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/5 font-medium"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>What group size do you usually coordinate dining for?</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "2 people (date/1-on-1)",
            "3-4 people",
            "5-6 people",
            "7+ people",
          ].map((option) => (
            <button
              key={option}
              onClick={() => setGroupSize(option)}
              className={`rounded-xl border-2 px-4 py-3 text-center text-sm transition-all ${
                groupSize === option
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/5 font-medium"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 3: Open feedback
    <div key="final" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Final Thoughts</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">Anything else you&apos;d want us to know?</p>
      </div>

      <Textarea
        placeholder="What would make this product a must-have for you? Any features you'd love? Things you didn't like?"
        value={additionalThoughts}
        onChange={(e) => setAdditionalThoughts(e.target.value)}
        rows={5}
      />
    </div>,
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-[var(--color-charcoal)]">Quick Survey</h2>
          <p className="text-xs text-[var(--color-muted-foreground)]">Almost done — {steps.length - step} questions left</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-[var(--color-coral)]" : "bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>

        <Card className="p-6 shadow-sm">{steps[step]}</Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="gap-1 bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="gap-1 bg-[var(--color-sage)] hover:bg-[var(--color-sage)]/90 text-white"
            >
              Submit
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
