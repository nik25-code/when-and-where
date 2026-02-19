"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Utensils } from "lucide-react";

interface WelcomePageProps {
  onComplete: (data: { name: string; email: string }) => void;
}

export default function WelcomePage({ onComplete }: WelcomePageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onComplete({ name: name.trim(), email: email.trim() });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-coral)] text-white">
            <Utensils className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-charcoal)]">
            When & Where
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)]">
            Less admin, more time with friends.
          </p>
        </div>

        <Card className="p-6 space-y-4 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-[var(--color-charcoal)]">
              We&apos;re building a new way to coordinate dining plans with friends.
              We&apos;d love your feedback on a few different approaches.
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              You&apos;ll try <strong>3 short experiences</strong> (~2 min each), then answer a few questions. That&apos;s it!
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="First name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={errors.name ? "border-red-400" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={errors.email ? "border-red-400" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-[var(--color-coral)] hover:bg-[var(--color-coral)]/90 text-white"
            size="lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>

        <p className="text-center text-xs text-[var(--color-muted-foreground)]">
          Your info is only used for this research study.
        </p>
      </div>
    </div>
  );
}
