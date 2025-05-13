
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
interface EventProps {
  action: string;
  category: string;
  label: string;
  value: number;
}

// Modified event function to accept measurementId
export const event = (props: EventProps, measurementId: string | undefined) => {
  if (typeof window.gtag === 'function' && measurementId) {
    window.gtag('event', props.action, {
      event_category: props.category,
      event_label: props.label,
      value: props.value,
    });
  }
};

interface GoogleAnalyticsProps {
  measurementId: string; // This prop is now required
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Internal pageview function using the measurementId prop
  const trackPageview = (url: URL) => {
    if (typeof window.gtag === 'function' && measurementId) {
      window.gtag('config', measurementId, {
        page_path: url.pathname + url.search,
      });
    }
  };

  useEffect(() => {
    // Component should only be rendered in production with a valid ID by layout.tsx,
    // but this check adds an extra layer of safety.
    if (process.env.NODE_ENV !== 'production' || !measurementId) {
      return;
    }

    const url = new URL(pathname, window.location.origin);
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    trackPageview(url);
  }, [pathname, searchParams, measurementId]); // Added measurementId to dependency array

  // Render scripts only in production and if measurementId is provided.
  // This check is somewhat redundant if layout.tsx already handles it, but ensures component robustness.
  if (process.env.NODE_ENV !== 'production' || !measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname + window.location.search,
            });
          `,
        }}
      />
    </>
  );
}
