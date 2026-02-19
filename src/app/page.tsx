"use client";

import { useState, useMemo } from "react";
import WelcomePage from "@/components/WelcomePage";
import ExperienceIntro from "@/components/ExperienceIntro";
import FormExperience from "@/components/FormExperience";
import ChatbotExperience from "@/components/ChatbotExperience";
import VoiceExperience from "@/components/VoiceExperience";
import FollowUpSurvey, { type SurveyResponses } from "@/components/FollowUpSurvey";
import ThankYouPage from "@/components/ThankYouPage";

type ExperienceType = "form" | "chatbot" | "voice";

type Step =
  | "welcome"
  | "intro1"
  | "experience1"
  | "intro2"
  | "experience2"
  | "intro3"
  | "experience3"
  | "survey"
  | "thanks";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Randomize experience order to avoid order bias
  const experienceOrder = useMemo<ExperienceType[]>(
    () => shuffleArray(["form", "chatbot", "voice"] as ExperienceType[]),
    []
  );

  const experienceComponents: Record<ExperienceType, React.FC<{ onComplete: () => void }>> = {
    form: FormExperience,
    chatbot: ChatbotExperience,
    voice: VoiceExperience,
  };

  const handleWelcomeComplete = (data: { name: string; email: string }) => {
    setUserName(data.name);
    setUserEmail(data.email);
    setStep("intro1");
  };

  const handleSurveyComplete = async (responses: SurveyResponses) => {
    // Save to localStorage as backup (Supabase integration later)
    const submission = {
      userName,
      userEmail,
      experienceOrder,
      responses,
      submittedAt: new Date().toISOString(),
    };

    // Store locally
    const existing = JSON.parse(localStorage.getItem("ww-responses") || "[]");
    existing.push(submission);
    localStorage.setItem("ww-responses", JSON.stringify(existing));

    console.log("Survey submission:", submission);
    setStep("thanks");
  };

  const getExperienceIndex = (): number => {
    if (step === "intro1" || step === "experience1") return 0;
    if (step === "intro2" || step === "experience2") return 1;
    if (step === "intro3" || step === "experience3") return 2;
    return 0;
  };

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return <WelcomePage onComplete={handleWelcomeComplete} />;

      case "intro1":
        return (
          <ExperienceIntro
            type={experienceOrder[0]}
            index={1}
            total={3}
            onStart={() => setStep("experience1")}
          />
        );
      case "experience1": {
        const Component = experienceComponents[experienceOrder[0]];
        return <Component onComplete={() => setStep("intro2")} />;
      }

      case "intro2":
        return (
          <ExperienceIntro
            type={experienceOrder[1]}
            index={2}
            total={3}
            onStart={() => setStep("experience2")}
          />
        );
      case "experience2": {
        const Component = experienceComponents[experienceOrder[1]];
        return <Component onComplete={() => setStep("intro3")} />;
      }

      case "intro3":
        return (
          <ExperienceIntro
            type={experienceOrder[2]}
            index={3}
            total={3}
            onStart={() => setStep("experience3")}
          />
        );
      case "experience3": {
        const Component = experienceComponents[experienceOrder[2]];
        return <Component onComplete={() => setStep("survey")} />;
      }

      case "survey":
        return (
          <FollowUpSurvey
            experienceOrder={experienceOrder}
            onComplete={handleSurveyComplete}
          />
        );

      case "thanks":
        return <ThankYouPage userName={userName} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      {/* Top progress bar */}
      {step !== "welcome" && step !== "thanks" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-lg px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
              When & Where Research
            </span>
            <div className="flex gap-1">
              {[
                "intro1", "experience1",
                "intro2", "experience2",
                "intro3", "experience3",
                "survey",
              ].map((s, i) => {
                const allSteps: Step[] = [
                  "intro1", "experience1",
                  "intro2", "experience2",
                  "intro3", "experience3",
                  "survey",
                ];
                const currentIndex = allSteps.indexOf(step);
                return (
                  <div
                    key={s}
                    className={`h-1.5 w-4 rounded-full transition-all ${
                      i <= currentIndex
                        ? "bg-[var(--color-coral)]"
                        : "bg-[var(--color-border)]"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {renderStep()}
    </div>
  );
}
