"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0, 0, 0.2, 1] as const;

// NOTE: do not branch these props on a client-only signal (reduced motion).
// Server and client must render identical initial markup or hydration breaks.
// Reduced motion is handled globally by <MotionConfig reducedMotion="user">.

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: 0.4, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export function StaggerGroup({
  children,
  className,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
