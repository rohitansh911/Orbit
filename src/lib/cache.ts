"use client";

// Simple TTL (Time To Live) cache for LocalStorage
// Ensures we don't spam the LLM on every page load.

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function setLocalCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(`orbit_ai_${key}`, JSON.stringify(entry));
}

export function getLocalCache<T>(key: string, ttlMs: number = 1000 * 60 * 60 * 12): T | null { // Default 12 hours
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(`orbit_ai_${key}`);
  if (!stored) return null;

  try {
    const entry: CacheEntry<T> = JSON.parse(stored);
    if (Date.now() - entry.timestamp > ttlMs) {
      localStorage.removeItem(`orbit_ai_${key}`);
      return null;
    }
    return entry.data;
  } catch (e) {
    return null;
  }
}

export function clearLocalCache(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`orbit_ai_${key}`);
}
