'use client';

import { formatTime } from '@/lib/math';
import { useState, useEffect, useRef } from 'react';

export default function Timer({
  eventStartTime,
  eventEndTime,
  setIsStartButton,
}: {
  eventStartTime: number;
  eventEndTime: number;
  setIsStartButton: (val: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'ended'>(
    'upcoming'
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentTimeMS =
      new Date().getTime() -
      (process.env.NODE_ENV! !== 'development'
        ? new Date().getTimezoneOffset() * 60000
        : 0);

    if (currentTimeMS < eventStartTime) {
      setStatus('upcoming');
      setTimeLeft((eventStartTime - currentTimeMS) / 1000);
    } else if (
      currentTimeMS >= eventStartTime &&
      currentTimeMS < eventEndTime
    ) {
      setStatus('ongoing');
      setTimeLeft((eventEndTime - currentTimeMS) / 1000);
      setIsStartButton(true);
    } else {
      setStatus('ended');
      setTimeLeft(0);
      setIsStartButton(false);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          if (status === 'upcoming') {
            setStatus('ongoing');
            setTimeLeft((eventEndTime - currentTimeMS) / 1000);
            setIsStartButton(true);
          } else {
            setStatus('ended');
            setIsStartButton(false);
            return 0;
          }
        }
        return prev;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-x-2 text-center font-noto text-lg font-bold text-gray-800 dark:text-white">
      {status === 'upcoming' && `Starts in: ${formatTime(timeLeft)}`}
      {status === 'ongoing' && `Ends in: ${formatTime(timeLeft)}`}
      {status === 'ended' && 'Event Ended'}
    </div>
  );
}
