import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Remove prefixos como "Capítulo 1:" que o modelo às vezes inclui no nome, já que a interface numera os capítulos
export function chapterTitle(name) {
  return String(name ?? "").replace(/^\s*cap[ií]tulo\s*\d+\s*[:.\-–]\s*/i, "");
}
