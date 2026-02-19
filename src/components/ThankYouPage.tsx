"use client";

import { Card } from "@/components/ui/card";
import { Heart, Utensils } from "lucide-react";

interface ThankYouPageProps {
  userName: string;
}

export default function ThankYouPage({ userName }: ThankYouPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-sage)] text-white">
          <Heart className="h-8 w-8" />
        </div>

        <Card className="p-8 space-y-4 shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">
            Thank you, {userName}!
          </h1>
          <p className="text-[var(--color-charcoal)]">
            Your feedback is incredibly valuable. It&apos;ll directly shape how we build When & Where.
          </p>
          <div className="rounded-lg bg-[var(--color-muted)] p-4 text-sm text-[var(--color-muted-foreground)]">
            We&apos;re working hard to make coordinating meals with friends effortless. Stay tuned for updates!
          </div>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Utensils className="h-4 w-4" />
          <span>When & Where — Less admin, more time with friends.</span>
        </div>
      </div>
    </div>
  );
}
