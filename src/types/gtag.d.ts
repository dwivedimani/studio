
// src/types/gtag.d.ts
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js',
    targetIdOrEventName: string | Date,
    options?: Record<string, unknown>
  ) => void;
  dataLayer?: unknown[];
}
