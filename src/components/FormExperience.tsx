"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Coffee,
  Sun,
  Utensils,
  Moon,
  Wine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FormExperienceProps {
  onComplete: () => void;
}

const mealTypes = [
  { id: "breakfast", label: "Breakfast", icon: <Coffee className="h-5 w-5" />, color: "bg-amber-50 border-amber-200 text-amber-700" },
  { id: "brunch", label: "Brunch", icon: <Sun className="h-5 w-5" />, color: "bg-orange-50 border-orange-200 text-orange-700" },
  { id: "lunch", label: "Lunch", icon: <Utensils className="h-5 w-5" />, color: "bg-green-50 border-green-200 text-green-700" },
  { id: "dinner", label: "Dinner", icon: <Moon className="h-5 w-5" />, color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { id: "drinks", label: "Drinks", icon: <Wine className="h-5 w-5" />, color: "bg-purple-50 border-purple-200 text-purple-700" },
];

const cuisineTypes = [
  "No Preference", "Italian", "Japanese", "Mexican", "Thai", "Indian",
  "Chinese", "Mediterranean", "American", "French", "Korean", "Vietnamese",
];

const vibeOptions = [
  "No Preference", "Romantic", "Trendy", "Casual", "Cozy",
  "Lively", "Upscale", "Outdoor", "Family-friendly",
];

const priceOptions = [
  { id: "none", label: "No Preference", icon: "" },
  { id: "budget", label: "Budget Friendly", icon: "$" },
  { id: "moderate", label: "Moderate", icon: "$$" },
  { id: "upscale", label: "Upscale", icon: "$$$" },
  { id: "fine", label: "Fine Dining", icon: "$$$$" },
];

const cities = ["New York", "Los Angeles", "San Francisco", "Chicago", "Miami", "Austin", "Seattle", "Boston", "Denver", "Portland"];

// Generate calendar dates for current month
function getCalendarDays() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  return { firstDay, daysInMonth, monthName, year, month, today };
}

export default function FormExperience({ onComplete }: FormExperienceProps) {
  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [yourName, setYourName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [specificRestaurants, setSpecificRestaurants] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");

  const calendar = getCalendarDays();

  const toggleMeal = (id: string) => {
    setSelectedMeals((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleDate = (day: number) => {
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleCuisine = (c: string) => {
    if (c === "No Preference") {
      setSelectedCuisines(["No Preference"]);
      return;
    }
    setSelectedCuisines((prev) => {
      const without = prev.filter((x) => x !== "No Preference");
      return without.includes(c) ? without.filter((x) => x !== c) : [...without, c];
    });
  };

  const toggleVibe = (v: string) => {
    if (v === "No Preference") {
      setSelectedVibes(["No Preference"]);
      return;
    }
    setSelectedVibes((prev) => {
      const without = prev.filter((x) => x !== "No Preference");
      return without.includes(v) ? without.filter((x) => x !== v) : [...without, v];
    });
  };

  // Generate time slots based on selected meals
  const getTimeSlots = () => {
    const slots: string[] = [];
    const ranges: [number, number][] = [];
    if (selectedMeals.includes("breakfast")) ranges.push([7, 10]);
    if (selectedMeals.includes("brunch")) ranges.push([10, 14]);
    if (selectedMeals.includes("lunch")) ranges.push([11, 15]);
    if (selectedMeals.includes("dinner")) ranges.push([17, 22]);
    if (selectedMeals.includes("drinks")) ranges.push([16, 24]);

    const seen = new Set<string>();
    for (const [start, end] of ranges) {
      for (let h = start; h < end; h++) {
        for (const m of [0, 15, 30, 45]) {
          const label = `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
          if (!seen.has(label)) {
            seen.add(label);
            slots.push(label);
          }
        }
      }
    }
    return slots;
  };

  const steps = [
    // Step 0: Event Details
    <div key="details" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Event Details</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">Tell us about your gathering</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="eventName">Event Name <span className="text-[var(--color-coral)]">*</span></Label>
          <Input id="eventName" placeholder="e.g. Sarah's Birthday Dinner" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="yourName">Your Name <span className="text-[var(--color-coral)]">*</span></Label>
          <Input id="yourName" placeholder="First and last name" value={yourName} onChange={(e) => setYourName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email <span className="text-[var(--color-coral)]">*</span></Label>
            <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone <span className="text-[var(--color-coral)]">*</span></Label>
            <Input id="phone" type="tel" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City <span className="text-[var(--color-coral)]">*</span></Label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select a city</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Event Description <span className="text-[var(--color-muted-foreground)] text-xs">(optional)</span></Label>
          <Textarea id="description" placeholder="Any details your friends should know..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>
      </div>
    </div>,

    // Step 1: Availability & Timing
    <div key="timing" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Availability & Timing</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">When works for you?</p>
      </div>

      <div className="space-y-1.5">
        <Label>Meal Type <span className="text-[var(--color-coral)]">*</span></Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {mealTypes.map((meal) => (
            <button
              key={meal.id}
              onClick={() => toggleMeal(meal.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                selectedMeals.includes(meal.id)
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/5 text-[var(--color-coral)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/30"
              }`}
            >
              {meal.icon}
              {meal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Available Dates <span className="text-[var(--color-coral)]">*</span></Label>
        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between mb-2">
            <button className="p-1 hover:bg-[var(--color-muted)] rounded">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">{calendar.monthName} {calendar.year}</span>
            <button className="p-1 hover:bg-[var(--color-muted)] rounded">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="p-1 font-medium text-[var(--color-muted-foreground)]">{d}</div>
            ))}
            {Array.from({ length: calendar.firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: calendar.daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isPast = day < calendar.today.getDate();
              const isSelected = selectedDates.includes(day);
              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => toggleDate(day)}
                  className={`rounded-md p-1.5 text-sm transition-all ${
                    isPast
                      ? "text-[var(--color-muted-foreground)]/40 cursor-not-allowed"
                      : isSelected
                      ? "bg-[var(--color-coral)] text-white font-medium"
                      : "hover:bg-[var(--color-coral)]/10"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDates.length > 0 && selectedMeals.length > 0 && (
        <div className="space-y-1.5">
          <Label>Available Times</Label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            {getTimeSlots().map((time) => (
              <button
                key={time}
                onClick={() => toggleTime(time)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedTimes.includes(time)
                    ? "bg-[var(--color-coral)] text-white"
                    : "bg-[var(--color-muted)] text-[var(--color-charcoal)] hover:bg-[var(--color-coral)]/10"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,

    // Step 2: Dining Preferences
    <div key="preferences" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Dining Preferences</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">What are you in the mood for?</p>
      </div>

      <div className="space-y-1.5">
        <Label>Preferred Neighborhoods <span className="text-[var(--color-coral)]">*</span></Label>
        <Input
          placeholder={city ? `e.g. Downtown ${city}, Midtown...` : "Select a city first"}
          value={neighborhoods}
          onChange={(e) => setNeighborhoods(e.target.value)}
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">Type &quot;no preference&quot; if open to anywhere</p>
      </div>

      <div className="space-y-1.5">
        <Label>Cuisine Types <span className="text-[var(--color-coral)]">*</span></Label>
        <div className="flex flex-wrap gap-1.5">
          {cuisineTypes.map((c) => (
            <button
              key={c}
              onClick={() => toggleCuisine(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCuisines.includes(c)
                  ? "bg-[var(--color-sage)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-charcoal)] hover:bg-[var(--color-sage)]/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Restaurant Vibes <span className="text-[var(--color-coral)]">*</span></Label>
        <div className="flex flex-wrap gap-1.5">
          {vibeOptions.map((v) => (
            <button
              key={v}
              onClick={() => toggleVibe(v)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedVibes.includes(v)
                  ? "bg-[var(--color-coral)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-charcoal)] hover:bg-[var(--color-coral)]/10"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Specific Restaurant Requests</Label>
        <Input
          placeholder="Any restaurants you'd love to try? Or 'no preference'"
          value={specificRestaurants}
          onChange={(e) => setSpecificRestaurants(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Price Range <span className="text-[var(--color-coral)]">*</span></Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {priceOptions.map((p) => (
            <button
              key={p.id}
              onClick={() => setPriceRange(p.id)}
              className={`flex flex-col items-center gap-0.5 rounded-lg border-2 p-2 text-xs font-medium transition-all ${
                priceRange === p.id
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/5 text-[var(--color-coral)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/30"
              }`}
            >
              {p.icon && <span className="text-base">{p.icon}</span>}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Dietary Restrictions</Label>
        <Input
          placeholder="e.g. vegetarian, gluten-free, nut allergy..."
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
        />
      </div>
    </div>,
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-lg space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {["Details", "Timing", "Preferences"].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? "bg-[var(--color-coral)]" : "bg-[var(--color-border)]"
                }`}
              />
              <p className={`mt-1 text-xs ${i <= step ? "text-[var(--color-coral)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
                {label}
              </p>
            </div>
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
              onClick={onComplete}
              className="gap-1 bg-[var(--color-sage)] hover:bg-[var(--color-sage)]/90 text-white"
            >
              Done — I&apos;ve seen enough
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
