'use client';

import useScreenshotProtection from '@/hooks/useScreenshotProtection';
import useSecurityProtection from '@/hooks/useSecurityPolicy';
import { AlertTriangle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import axios from 'axios';
import QuizCountdown from './QuizCountdown';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getMirageQuestion } from '@/app/(backend)/actions/getQuiz';
import QuizTimeLeft from './QuizTimeLeft';
import { Button } from '../ui/button';
import {
  getMillisecondsFromTimeString,
  getMillisecondsFromTimeStringFromLocalStorage,
} from '@/lib/math';
import { useRouter } from 'next/navigation';
import useFullscreenControl from '@/hooks/useFullscreenControl';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import CodeEditor from '../codeEditor';

const SecureCodeMiragePage = ({
  startTime,
  endTime,
  userId,
  quizId,
  competition,
  duration,
  uniqueIdForMiragePage,
  isDurationBased,
}: {
  startTime: number | null;
  endTime: number | null;
  userId: string;
  quizId: string;
  uniqueIdForMiragePage: string;
  competition: string;
  duration: string;
  isDurationBased: boolean;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isQuizStart, setIsQuizStart] = useState<boolean>(false);
  const [isQuizTimeEnd, setIsQuizTimeEnd] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[] | null>([]);
  const tabHiddenTime = useRef<number | null>(null);
  const [tabWarnings, setTabWarnings] = useState<number>(5);
  const [startQuizTimeFromLocalStorage, setStartQuizTimeFromLocalStorage] =
    useState<number>(0);
  const [durationBasedEndTime, setDurationBasedEndTime] = useState<number>(0);
  const [quizIsSubmitted, setQuizIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeCodeEditor, setActiveCodeEditor] = useState<string>('html');
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [cssCode, setCssCode] = useState<string>('');
  const [previewFullHtml, setPreviewFullHtml] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      const questionsData: any = await getMirageQuestion(competition, quizId);
      setQuestions(questionsData);
      setCssCode(
        questionsData !== null
          ? questionsData[0].cssBoilerPlate.replace(/<\/?codeBlock>/g, '')
          : ''
      );
      setHtmlCode(
        questionsData !== null
          ? questionsData[0].htmlBoilerPlate.replace(/<\/?codeBlock>/g, '')
          : ''
      );
    };
    if (isQuizStart) {
      fetchQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizStart]);

  useSecurityProtection();
  const { FullscreenModal, showModal, enableFullScreen } =
    useFullscreenControl();
  // const { isScreenshotAttempted } = useScreenshotProtection();

  useEffect(() => {
    enableFullScreen();
    const storedWarnings = Number(
      localStorage.getItem('sbattxgninrawxahdraps')
    );
    setTabWarnings(storedWarnings);
    const storedTime = Number(localStorage.getItem('wonxniegxtraxziuq'));
    const durationBasedEndTimeVal =
      getMillisecondsFromTimeStringFromLocalStorage(duration, storedTime);
    setDurationBasedEndTime(durationBasedEndTimeVal);
    setStartQuizTimeFromLocalStorage(storedTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabHiddenTime.current = Date.now();
        const newTabWarnings = tabWarnings - 1;

        setTabWarnings(newTabWarnings);
        localStorage.setItem(
          'sbattxgninrawxahdraps',
          newTabWarnings.toString()
        );
      } else {
        if (tabHiddenTime.current) {
          const timeAway = (Date.now() - tabHiddenTime.current) / 1000;
          if (timeAway >= 40 || tabWarnings <= 0) {
            submitQuiz();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabWarnings]);

  const editorContainerRef = useRef<HTMLDivElement>(null);
  // Add this effect to handle auto-scrolling
  useEffect(() => {
    if (editorContainerRef.current) {
      const container = editorContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [htmlCode, cssCode]);

  const submitQuiz = async () => {
    const fullCode = htmlCode.replace(
      /<\/head>/,
      `<style>${cssCode}</style></head>`
    );
    localStorage.setItem('atadxresuxlmthllufxweiverpxahdraps', `${fullCode}`);

    setIsSubmitting(true);
    const currentTime = isDurationBased
      ? startQuizTimeFromLocalStorage
      : Number(startTime);
    const currentDateMS =
      new Date().getTime() -
      (process.env.NODE_ENV! !== 'development'
        ? new Date().getTimezoneOffset() * 60000
        : 0);

    const timeSpent = (currentDateMS - currentTime) / 1000;
    const fullHtml = localStorage.getItem('atadxresuxlmthllufxweiverpxahdraps');
    if (!fullHtml) {
      return;
    }
    try {
      const response = await axios.post(
        `/api/submit-quiz/${competition}/${quizId}`,
        {
          userId,
          fullHtml: fullHtml,
          timeSpent,
        }
      );
      if (response.status !== 200) {
        throw new Error('Quiz submission failed');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      localStorage.setItem('sbattxgninrawxahdraps', '5.5');
      localStorage.setItem('stnuocxhserferxgninrawxahdraps', '0');
      localStorage.setItem('atadxresuxlmthllufxweiverpxahdraps', '');
      localStorage.setItem('wonxniegxtraxziuq', '0');
      setQuizIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setTabWarnings((prev) => prev - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (tabWarnings <= 0) {
      submitQuiz();
      setQuizIsSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const previewBtnClick = () => {
    const fullCode = htmlCode.replace(
      /<\/head>/,
      `<style>${cssCode}</style></head>`
    );
    localStorage.setItem('atadxresuxlmthllufxweiverpxahdraps', `${fullCode}`);
    setPreviewFullHtml(fullCode);
  };

  if (questions === null) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
        <FullscreenModal />
      </div>
    );
  }

  if (!isQuizStart) {
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center">
          {/* Warning Message */}
          <div className="mb-6 max-w-2xl rounded-lg border border-red-400 bg-red-100 px-6 py-4 text-red-700 shadow-md">
            <h2 className="flex items-center justify-center gap-2 text-lg font-bold">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Important Notice!
            </h2>
            <p className="mt-2 text-sm">
              ❌ You are <strong>not allowed</strong> to visit this page before
              the quiz starts!
            </p>
            <p className="mt-1 text-sm">
              ⚠️ <strong>Do NOT refresh or switch tabs</strong>, or your quiz
              may be auto-submitted, and you will be disqualified!
            </p>
            <p className="mt-1 text-sm">
              ⚠️ <strong>Do NOT leave tab for more than 30sec</strong>,
              otherwise, your quiz may be auto-submitted, and you will be
              disqualified!
            </p>
          </div>

          {/* Quiz Countdown */}
          <div className="mb-4 text-4xl font-bold capitalize text-gray-900">
            {competition.replaceAll('-', ' ')}
          </div>
          <QuizCountdown
            eventStartTime={Number(
              isDurationBased ? startQuizTimeFromLocalStorage : startTime
            )}
            setIsQuizStart={setIsQuizStart}
            eventEndTime={Number(
              isDurationBased
                ? getMillisecondsFromTimeString(duration)
                : endTime
            )}
            setIsQuizTimeEnd={setIsQuizTimeEnd}
          />

          {/* Alert for Remaining Warnings */}
          <Alert
            variant="destructive"
            className="mt-6 flex w-full max-w-2xl items-center justify-between rounded-md px-6 py-3"
          >
            <AlertDescription className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>
                Warning: Switching tabs or refreshing may result in
                auto-submission!
              </span>
            </AlertDescription>
            <span className="font-semibold text-red-700">
              Warnings Left: {tabWarnings}
            </span>
          </Alert>
        </div>
        <FullscreenModal />
      </>
    );
  }

  if (isQuizTimeEnd) {
    return (
      <>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-6 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="animate-pulse text-5xl font-extrabold text-red-500">
              {"⏳ Time's Up!"}
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Your quiz session has ended. Please wait while we submit your
              answers.
            </p>
            <div className="mt-6">
              <div className="h-1 w-40 animate-pulse rounded-full bg-red-500"></div>
            </div>
          </motion.div>
          <Link
            target="_blank"
            href={`/spardha/platform/leaderboard/${competition}/${quizId}`}
            className="mt-6 inline-block transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-indigo-600 hover:to-blue-500"
            onClick={(event) => {
              event.preventDefault();
              window.open(
                `/spardha/platform/leaderboard/${competition}/${quizId}`,
                '_blank'
              );
              router.replace('/spardha');
            }}
          >
            LeaderBoard
          </Link>
        </div>
        <FullscreenModal />
      </>
    );
  }

  if (quizIsSubmitted) {
    localStorage.setItem('sbattxgninrawxahdraps', '5.5');
    localStorage.setItem('stnuocxhserferxgninrawxahdraps', '0');
    localStorage.setItem('atadxresuxlmthllufxweiverpxahdraps', '');
    localStorage.setItem('wonxniegxtraxziuq', '0');
    return (
      <>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-6 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-2xl border border-white/20 bg-white/10 px-10 py-12 text-center shadow-lg backdrop-blur-md"
          >
            <motion.h1 className="text-2xl font-extrabold text-green-500 drop-shadow-lg">
              Quiz Submitted!
            </motion.h1>

            <p className="mt-4 text-lg text-gray-300 md:text-xl">
              Your quiz session has ended. Check your results below.
            </p>

            <Link
              target="_blank"
              href={`/spardha/platform/results/${competition}/${quizId}`}
              className="mt-6 inline-block transform rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:from-indigo-600 hover:to-blue-500"
              onClick={(event) => {
                event.preventDefault(); // Prevent Next.js handling from overriding the new tab behavior
                localStorage.setItem('sbattxgninrawxahdraps', '5.5');
                localStorage.setItem('stnuocxhserferxgninrawxahdraps', '0');
                localStorage.setItem('atadxresuxlmthllufxweiverpxahdraps', '');
                localStorage.setItem('wonxniegxtraxziuq', '0');
                window.open(
                  `/spardha/platform/results/${competition}/${quizId}`,
                  '_blank'
                );
                router.replace('/spardha');
              }}
            >
              🎯 View Your Result
            </Link>
          </motion.div>
        </div>
        <FullscreenModal />
      </>
    );
  }

  if (!questions.length && isQuizStart) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
          <p>No Questions Found</p>
        </div>
        <FullscreenModal />
      </>
    );
  }

  return (
    <>
      {/* {isScreenshotAttempted && (
        <div className="relative my-20 h-screen w-full items-start justify-center">
          <Alert variant="destructive" className="z-[1200] w-full">
            <AlertTriangle className="size-5" />
            <AlertDescription className="text-lg font-semibold">
              Warning: Attempting to take screenshots or switch tabs or
              ExitFullScreenMode may result in automatic submission.
            </AlertDescription>
          </Alert>
        </div>
      )} */}
      <FullscreenModal />
      <div className="fixed inset-0 top-28 z-20 mx-auto mb-0 flex w-full flex-col items-start justify-center gap-1 overflow-hidden rounded-b-xl border border-gray-300 bg-white px-3 py-1 shadow-lg dark:border-gray-700 dark:bg-navy-blue sm:top-14">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-fit items-center justify-end gap-4">
            <span className="whitespace-nowrap font-heading text-lg font-semibold capitalize text-gray-900 dark:text-gray-100">
              {quizId.replaceAll('-', ' ')}
            </span>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-full hover:bg-gray-200 dark:hover:bg-gray-800 ${
                    isOpen
                      ? 'border-[1px] border-black bg-slate-300 text-black'
                      : ''
                  }`}
                >
                  <span className="flex w-fit flex-row items-center justify-center gap-2 px-2">
                    <Eye className="size-5" /> View page
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="mt-24 h-screen w-screen max-w-none overflow-y-auto py-12 sm:mt-14 sm:py-14">
                <iframe
                  src={`/preview-pages/code-mirage-ui-pages/${uniqueIdForMiragePage}`}
                  className="h-full w-full border-none"
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex w-fit items-center justify-end gap-4">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={previewBtnClick}
                  className={`text-md px-6 py-2 font-medium ${
                    isPreviewOpen
                      ? 'border-[1px] border-black bg-slate-300 text-black'
                      : ''
                  }`}
                >
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="mt-24 h-screen w-screen max-w-none overflow-y-auto py-12 sm:mt-14 sm:py-14">
                <iframe
                  src={`/compile-code-mirage/preview`}
                  className="h-full w-full border-none"
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="default"
              className="text-md border-[2px] bg-green-600/30 px-6 py-2 font-medium text-green-600 hover:bg-green-600 hover:text-black dark:text-green-500 dark:hover:text-white"
              disabled={isSubmitting}
              onClick={submitQuiz}
            >
              {isSubmitting ? 'submitting....' : 'Submit'}
            </Button>
            <QuizTimeLeft
              onTimeup={submitQuiz}
              quizEndTime={
                isDurationBased ? durationBasedEndTime : Number(endTime)
              }
              setIsQuizTimeEnd={setIsQuizTimeEnd}
            />
          </div>
        </div>
        {tabWarnings >= 0 && (
          <div className="w-full">
            <Alert
              variant="destructive"
              className="mb-2 flex items-center justify-between py-1"
            >
              <span className="flex">
                <AlertTriangle />
                Warning: Switching tabs or refresh may result in
                auto-submission!
              </span>
              <span>Warning Left : {tabWarnings}</span>
            </Alert>
          </div>
        )}
        {/* Code Editor Section */}
        <div
          className="h-full max-h-[100vh] w-full rounded-lg"
          ref={editorContainerRef}
        >
          <div className="flex w-full gap-2 border-b pb-2">
            <button
              onClick={() => {
                setActiveCodeEditor('html');
                setTimeout(() => {
                  if (editorContainerRef.current) {
                    editorContainerRef.current.scrollTop =
                      editorContainerRef.current.scrollHeight;
                  }
                }, 10);
              }}
              className={`rounded-t-md px-4 py-2 ${
                activeCodeEditor !== 'html'
                  ? 'bg-white font-semibold dark:bg-gray-800'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              index.html
            </button>
            <button
              onClick={() => {
                setActiveCodeEditor('css');
                setTimeout(() => {
                  if (editorContainerRef.current) {
                    editorContainerRef.current.scrollTop =
                      editorContainerRef.current.scrollHeight;
                  }
                }, 10);
              }}
              className={`rounded-t-md px-4 py-2 ${
                activeCodeEditor !== 'css'
                  ? 'bg-white font-semibold dark:bg-gray-800'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              styles.css
            </button>
          </div>
          <div className="relative h-fit w-full rounded-b-md p-0 shadow-md">
            {activeCodeEditor === 'html' && (
              <CodeEditor
                initialLanguage="html"
                height="100%"
                width="100%"
                onChange={(value) => {
                  setHtmlCode(value);
                  // This ensures scroll happens after the editor content updates
                  setTimeout(() => {
                    if (editorContainerRef.current) {
                      editorContainerRef.current.scrollTop =
                        editorContainerRef.current.scrollHeight;
                    }
                  }, 10);
                }}
                initialCode={htmlCode}
              />
            )}
            {activeCodeEditor === 'css' && (
              <CodeEditor
                initialLanguage="css"
                onChange={(value) => {
                  setCssCode(value);
                  // This ensures scroll happens after the editor content updates
                  setTimeout(() => {
                    if (editorContainerRef.current) {
                      editorContainerRef.current.scrollTop =
                        editorContainerRef.current.scrollHeight;
                    }
                  }, 10);
                }}
                height="100%"
                width="100%"
                initialCode={cssCode}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SecureCodeMiragePage;
