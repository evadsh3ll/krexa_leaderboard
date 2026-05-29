"use client";

import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setError("Enter a valid email.");
      return;
    }
    setError("");
    setDone(true);
    // No backend yet — this is where the waitlist POST would go.
  };

  if (done) {
    return (
      <div className="card glow-border mx-auto flex max-w-md items-center justify-center gap-3 px-6 py-5">
        <span aria-hidden className="text-lg">✓</span>
        <p className="text-sm text-text">
          You&apos;re on the list — we&apos;ll email{" "}
          <span className="font-medium text-gold">{email}</span> when your credit
          line opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-md">
      <div className="card glow-border flex flex-col gap-2 p-2 sm:flex-row">
        <label htmlFor="wl-email" className="sr-only">
          Email address
        </label>
        <input
          id="wl-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-[44px] w-full rounded-lg bg-transparent px-4 text-text placeholder:text-text-mute focus:outline-none"
        />
        <button
          type="submit"
          className="btn-primary min-h-[44px] shrink-0 px-5 text-sm"
        >
          Join waitlist
        </button>
      </div>
      <p
        className="mt-2 min-h-[18px] px-1 text-left text-xs"
        style={{ color: error ? "var(--blinky)" : "var(--text-mute)" }}
        aria-live="polite"
      >
        {error || "No spam. One email when credit lines open."}
      </p>
    </form>
  );
}
