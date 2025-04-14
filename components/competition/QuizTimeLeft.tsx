import { formatTime } from '@/lib/math';
import { Clock } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const QuizTimeLeft = ({
  onTimeup,
  quizEndTime,
  setIsQuizTimeEnd,
}: {
  onTimeup: () => void;
  quizEndTime: number;
  setIsQuizTimeEnd: (isEnd: boolean) => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentTimeMS =
      new Date().getTime() -
      (process.env.NODE_ENV! !== 'development'
        ? new Date().getTimezoneOffset() * 60000
        : 0);

    const timeLeftInSeconds = Math.max((quizEndTime - currentTimeMS) / 1000, 0);

    setTimeLeft(timeLeftInSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeup;
          setIsQuizTimeEnd(true);
          return 0;
        }
        return prev - 1;
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
    <div className="flex items-center text-navy-blue dark:text-baby-blue">
      <Clock className="mr-2 h-5 w-5" />
      <span className="text-xl font-semibold">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default QuizTimeLeft;
