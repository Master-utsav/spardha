'use client';

import { formatTime } from '@/lib/math';
import React, { useEffect, useRef, useState } from 'react';

const QuizCountdown = ({
  eventStartTime,
  setIsQuizStart,
  eventEndTime,
  setIsQuizTimeEnd,
}: {
  eventStartTime: number;
  eventEndTime: number;
  setIsQuizStart: (val: boolean) => void;
  setIsQuizTimeEnd: (val: boolean) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentTimeMS =
      new Date().getTime() -
      (process.env.NODE_ENV! !== 'development'
        ? new Date().getTimezoneOffset() * 60000
        : 0);

    const timeLeftInSeconds = Math.max(
      (eventStartTime - currentTimeMS) / 1000,
      0
    );
    const quizEndIn = Math.max((eventEndTime - currentTimeMS) / 1000, 0);

    setTimeLeft(timeLeftInSeconds);

    if (quizEndIn <= 0) {
      setIsQuizTimeEnd(true);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setIsQuizStart(true);
          return 0;
        }
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
    <div className="text-lg font-semibold text-gray-700">
      Quiz starts in:{' '}
      <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default QuizCountdown;
