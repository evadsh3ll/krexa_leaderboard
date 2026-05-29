"use client";

import { useRef } from "react";
import { motion, MotionConfig, type Variants } from "motion/react";
import MazeBackground from "./MazeBackground";
import Countdown from "./Countdown";
import StatStrip from "./StatStrip";
import Leaderboard from "./Leaderboard";
import HowToPlay from "./HowToPlay";
import KonamiPower from "./KonamiPower";
import PacManBanner from "./PacManBanner";
import Waitlist from "./Waitlist";

const EASE_OUT = [0, 0, 0.2, 1] as const;

const NAV = [
  ["#board", "Leaderboard"],
  ["#how", "How it works"],
  ["#waitlist", "Waitlist"],
] as const;

const POST_TEXT =
  "I'm in the #KREXABILLCHALLENGE 🟡 my May Claude/OpenAI bill is on the leaderboard. The 3 biggest spend builders win @krexa_xyz credits. Post your bill 👇";
const POST_URL =
  "https://twitter.com/intent/tweet?text=" + encodeURIComponent(POST_TEXT);

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export default function HomeClient() {
  const scaredRef = useRef(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="arcade-grid" aria-hidden="true" />
      <MazeBackground scaredRef={scaredRef} />
      <div className="crt" aria-hidden="true" />
      <KonamiPower scaredRef={scaredRef} />

      <main className="relative z-10 mx-auto max-w-[1140px] px-5 pb-28 sm:px-8">
        {/* Nav */}
        <nav className="flex items-center justify-between gap-4 py-5">
          <a href="#top" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/krexa-logo.png"
              alt="Krexa"
              width={30}
              height={30}
              className="h-[30px] w-[30px]"
            />
            <span className="font-pixel text-[13px] tracking-wide text-text">
              KREXA
            </span>
          </a>
          <div className="hidden items-center gap-1 sm:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="link-chip">
                {label}
              </a>
            ))}
          </div>
          <a href="#waitlist" className="btn-primary px-4 py-2 text-[13px]">
            Join waitlist
          </a>
        </nav>

        {/* Event title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="flex items-center justify-center gap-3 pt-6 sm:gap-5"
        >
          <span
            className="hidden h-px max-w-[140px] flex-1 sm:block"
            style={{ background: "linear-gradient(90deg, transparent, var(--border-strong))" }}
          />
          <a
            href={POST_URL}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2.5"
          >
            <Spark />
            <span
              className="text-gradient font-bold uppercase leading-none tracking-[0.16em] transition-[filter] duration-200 group-hover:brightness-110 [font-size:clamp(20px,5.2vw,40px)]"
              style={{ filter: "drop-shadow(0 0 22px rgba(37,205,255,0.35))" }}
            >
              #KREXABILLCHALLENGE
            </span>
            <Spark />
          </a>
          <span
            className="hidden h-px max-w-[140px] flex-1 sm:block"
            style={{ background: "linear-gradient(90deg, var(--border-strong), transparent)" }}
          />
        </motion.div>

        {/* Pac-Man chase banner — always animates */}
        <div className="pt-2">
          <PacManBanner />
        </div>

        {/* Hero */}
        <header id="top" className="pt-2 pb-8">
          <motion.div
            className="flex flex-col items-center text-center"
            variants={group}
            initial="hidden"
            animate="show"
          >
            <motion.span variants={item} className="eyebrow">
              <Dot /> May season · live on Solana
            </motion.span>

            <motion.h1
              variants={item}
              className="section-title mt-6 max-w-[16ch] text-balance [font-size:clamp(40px,8.8vw,88px)]"
            >
              Post your AI bill.
              <br />
              <span className="text-gradient">Eat the leaderboard.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-relaxed text-text-dim sm:text-lg"
            >
              Post your May{" "}
              <span className="font-medium text-text">Claude</span> or{" "}
              <span className="font-medium text-text">OpenAI</span> bill. The 3
              biggest spend builders win Krexa credits. First of its kind, anywhere.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href={POST_URL}
                target="_blank"
                rel="noopener"
                className="btn-primary px-6 py-3 text-[15px]"
              >
                Post your bill on X
                <span aria-hidden>↗</span>
              </a>
              <a href="#board" className="link-chip px-4 py-3 text-sm">
                See the leaderboard
              </a>
            </motion.div>

            <motion.div variants={item} className="mt-9">
              <Countdown />
            </motion.div>

            <motion.div variants={item} className="w-full">
              <StatStrip />
            </motion.div>
          </motion.div>
        </header>

        <Leaderboard />
        <HowToPlay />

        {/* Waitlist / footer */}
        <footer id="waitlist" className="mt-28 scroll-mt-8">
          <div className="card glow-border overflow-hidden px-6 py-12 text-center sm:px-12">
            <span className="eyebrow">Get early access</span>
            <h2 className="section-title mt-6 text-[clamp(28px,5vw,46px)]">
              Claim your <span className="text-gradient">credit line</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-text-dim">
              Your AI spend is your credit history. Join the waitlist and we&apos;ll
              open your Krexa credit line on Solana.
            </p>
            <div className="mt-8">
              <Waitlist />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-5 border-t border-border pt-10 text-center">
            <a href="#top" className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/krexa-logo.png"
                alt="Krexa"
                width={26}
                height={26}
                className="h-[26px] w-[26px]"
              />
              <span className="font-pixel text-[12px] tracking-wide text-text">
                KREXA
              </span>
            </a>
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/krexa_xyz"
                target="_blank"
                rel="noopener"
                className="link-chip inline-flex items-center gap-2"
              >
                <XLogo /> @krexa_xyz
              </a>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-text-dim">
              Krexa Credit Corp — your AI spend, your credit line. Built for the
              #KREXABILLCHALLENGE. Not financial advice.
            </p>
            <p className="font-mono text-xs text-text-mute">
              ↑ ↑ ↓ ↓ ← → ← → B A
            </p>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}

function Dot() {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: "var(--gold)", boxShadow: "0 0 8px var(--gold)" }}
    />
  );
}

function Spark() {
  return (
    <span
      aria-hidden
      className="inline-block h-1.5 w-1.5 rotate-45 sm:h-2 sm:w-2"
      style={{ background: "var(--gold)", boxShadow: "0 0 12px var(--gold)" }}
    />
  );
}

function XLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}
