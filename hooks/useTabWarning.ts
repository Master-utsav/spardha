import { useEffect, useRef, useState } from 'react';

interface UseTabWarningProps {
  initialWarnings?: number;
  timeoutSeconds?: number;
  onLimitReached: () => void;
}

export function useTabWarning({
  initialWarnings = 5,
  timeoutSeconds = 30,
  onLimitReached,
}: UseTabWarningProps) {
  const tabHiddenTime = useRef<number | null>(null);
  const [tabWarnings, setTabWarnings] = useState<number>(initialWarnings);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabHiddenTime.current = Date.now();
        const newTabWarnings = tabWarnings - 1;

        if (newTabWarnings <= 0) {
          onLimitReached();
        }

        setTabWarnings(newTabWarnings);
        localStorage.setItem(
          'sbattxgninrawxahdraps',
          newTabWarnings.toString()
        );
      } else {
        if (tabHiddenTime.current) {
          const timeAway = (Date.now() - tabHiddenTime.current) / 1000;
          if (timeAway >= timeoutSeconds || tabWarnings <= 0) {
            onLimitReached();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabWarnings, onLimitReached, timeoutSeconds]);

  return { tabWarnings };
}
