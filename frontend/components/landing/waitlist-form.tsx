"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to join waitlist");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl bg-[oklch(0.70_0.25_142.5)]/10 border border-[oklch(0.70_0.25_142.5)]/30 text-[oklch(0.70_0.25_142.5)] mx-auto max-w-md w-full animate-in fade-in zoom-in duration-300">
        <div className="h-10 w-10 rounded-full bg-[oklch(0.70_0.25_142.5)]/20 flex items-center justify-center mb-2">
          <Check className="w-5 h-5" />
        </div>
        <p className="font-medium text-center">You're on the list!</p>
        <p className="text-sm opacity-80 text-center">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative z-20">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="flex-1 bg-background/60 backdrop-blur-md border-[var(--glass-border)] h-12"
        />
        <Button 
          type="submit" 
          disabled={loading} 
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8 group shrink-0"
        >
          {loading ? "Joining..." : "Join Waitlist"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>
      {error && (
        <p className="text-sm text-red-500 mt-2 text-center absolute -bottom-8 w-full">
          {error}
        </p>
      )}
    </div>
  );
}
