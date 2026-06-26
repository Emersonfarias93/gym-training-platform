"use client";

import { useEffect, useState } from "react";

import { PIX_EXPIRATION_WARNING_SECONDS } from "@/lib/payment";

export type PixCountdown = {
  /** Tempo restante em ms (>= 0). */
  remainingMs: number;
  /** Rotulo formatado "mm:ss". */
  label: string;
  /** Se ja passou da validade. */
  expired: boolean;
  /** Se esta nos ultimos segundos (limiar de alerta visual). */
  isWarning: boolean;
};

/** A Confrapix retorna "YYYY-MM-DD HH:mm:ss" (datetime local, sem timezone). */
function parseExpiresAt(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Cronometro regressivo dirigido pela validade real (`expiresAt`) da transacao.
 * Deriva o tempo do timestamp absoluto (robusto a aba em segundo plano), tica 1x/s
 * e para o intervalo ao expirar.
 */
export function usePixCountdown(expiresAt: string | undefined): PixCountdown {
  const expiresAtMs = parseExpiresAt(expiresAt);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (expiresAtMs === null) {
      return;
    }

    setNow(Date.now());
    if (Date.now() >= expiresAtMs) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= expiresAtMs) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiresAtMs]);

  if (expiresAtMs === null) {
    return { remainingMs: 0, label: "00:00", expired: false, isWarning: false };
  }

  const remainingMs = expiresAtMs - now;
  const expired = remainingMs <= 0;
  const isWarning = !expired && remainingMs <= PIX_EXPIRATION_WARNING_SECONDS * 1000;

  return {
    remainingMs: Math.max(0, remainingMs),
    label: formatRemaining(remainingMs),
    expired,
    isWarning
  };
}
