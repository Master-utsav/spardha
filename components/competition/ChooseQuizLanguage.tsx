'use client';

import React, { useEffect, useRef, useState } from 'react';
import Timer from './Timer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';
import useScreenshotProtection from '@/hooks/useScreenshotProtection';
import useAutoFullScreen from '@/hooks/useAutoFullscreen';
import {
  formatTimeDurationForString,
  getMillisecondsFromTimeString,
} from '@/lib/math';
import { useRouter } from 'next/navigation';
import useSecurityProtection from '@/hooks/useSecurityPolicy';
import useFullscreenControl from '@/hooks/useFullscreenControl';

const ChooseQuizLanguage = ({
  startTime,
  endTime,
  languages,
  quizId,
  rules,
  isDurationBased,
  duration,
  competition,
}: {
  startTime: number | null;
  endTime: number | null;
  languages: string[];
  quizId: string;
  rules: string[];
  isDurationBased: boolean;
  duration: string;
  competition: string;
}) => {
  const [isStartButton, setIsStartButton] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    languages[-1]
  );
  const [currentTime, setCurrentTime] = useState<number>(1000);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onStartQuiz = () => {
    try {
      setIsLoading(true);
      if (
        !localStorage.getItem('wonxniegxtraxziuq') ||
        localStorage.getItem('wonxniegxtraxziuq') === '0'
      ) {
        localStorage.setItem(
          'wonxniegxtraxziuq',
          String(
            new Date().getTime() -
              (process.env.NODE_ENV! !== 'development'
                ? new Date().getTimezoneOffset() * 60000
                : 0)
          )
        );
      }
      if (!localStorage.getItem('sbattxgninrawxahdraps')) {
        localStorage.setItem('sbattxgninrawxahdraps', '5.5');
      }
      if (!localStorage.getItem('stnuocxhserferxgninrawxahdraps')) {
        localStorage.setItem('stnuocxhserferxgninrawxahdraps', '0');
      }
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setIsLoading(false);
      router.push(
        `/spardha/platform/${competition}/${quizId}/${selectedLanguage}`
      );
    }
  };

  // useAutoFullScreen();
  useSecurityProtection();
  const { FullscreenModal } = useFullscreenControl();

  useEffect(() => {
    const currentTimeMS =
      new Date().getTime() -
      (process.env.NODE_ENV! !== 'development'
        ? new Date().getTimezoneOffset() * 60000
        : 0);
    setCurrentTime(currentTimeMS);
    if (isDurationBased && selectedLanguage) {
      setIsStartButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  const { isScreenshotAttempted } = useScreenshotProtection();

  return (
    <div ref={containerRef} className="mx-auto flex max-w-7xl items-center">
      {isScreenshotAttempted && (
        <Alert variant="destructive" className="z-[1200] w-full">
          <AlertTriangle className="size-5" />
          <AlertDescription className="text-lg font-semibold">
            Warning: Attempting to take screenshots or switch tabs or
            ExitFullScreenMode may result in automatic submission.
          </AlertDescription>
        </Alert>
      )}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold capitalize text-navy-blue dark:text-baby-blue">
                {quizId.replaceAll('-', ' ')} Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="text-center">
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                  Select your preferred programming language to begin the quiz.
                </p>
                <div className="mx-auto max-w-xs">
                  <Select onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-navy-blue dark:text-baby-blue">
                  Quiz Rules:
                </h3>
                <ul className="list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-400">
                  {rules.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                {isDurationBased ? (
                  <div className="space-x-2 text-center font-noto text-lg font-bold text-gray-800 dark:text-white">
                    Duration: {formatTimeDurationForString(duration)}
                  </div>
                ) : (
                  <Timer
                    eventStartTime={Number(
                      isDurationBased ? currentTime : startTime
                    )}
                    eventEndTime={Number(
                      isDurationBased
                        ? getMillisecondsFromTimeString(duration)
                        : endTime
                    )}
                    setIsStartButton={setIsStartButton}
                  />
                )}
                <Button
                  className="flex items-center justify-center bg-blue-grotto text-white hover:bg-navy-blue"
                  disabled={selectedLanguage === undefined || !isStartButton}
                  onClick={onStartQuiz}
                >
                  {isLoading ? 'Starting' : 'Start Quiz'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <FullscreenModal />
    </div>
  );
};

export default ChooseQuizLanguage;
