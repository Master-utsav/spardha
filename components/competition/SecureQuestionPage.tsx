'use client';

import useAutoFullScreen from '@/hooks/useAutoFullscreen';
import useScreenshotProtection from '@/hooks/useScreenshotProtection';
import useSecurityProtection from '@/hooks/useSecurityPolicy';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import useRefreshPrevent from '@/hooks/useRefreshPrevent';
import { SanitizedQuizQuestion } from '@/constants/interface';
import axios from 'axios';
import QuizCountdown from './QuizCountdown';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllQuestionsOfQuiz } from '@/app/(backend)/actions/getQuiz';
import { renderFormattedText } from '@/lib/parsedText';
import { Card, CardContent } from '../ui/card';
import QuizTimeLeft from './QuizTimeLeft';
import { Button } from '../ui/button';
import {
  getMillisecondsFromTimeString,
  getMillisecondsFromTimeStringFromLocalStorage,
  shuffleArray,
} from '@/lib/math';
import { useRouter } from 'next/navigation';
import useFullscreenControl from '@/hooks/useFullscreenControl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CodeEditor from '../codeEditor';

const SecureQuestionPage = ({
  startTime,
  endTime,
  userId,
  language,
  quizId,
  competition,
  duration,
  isDurationBased,
}: {
  startTime: number | null;
  endTime: number | null;
  userId: string;
  language: string;
  quizId: string;
  competition: string;
  duration: string;
  isDurationBased: boolean;
}) => {
  const router = useRouter();
  const [isQuizStart, setIsQuizStart] = useState<boolean>(false);
  const [isQuizTimeEnd, setIsQuizTimeEnd] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[] | null>([]);
  const tabHiddenTime = useRef<number | null>(null);
  const [tabWarnings, setTabWarnings] = useState<number>(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [startQuizTimeFromLocalStorage, setStartQuizTimeFromLocalStorage] =
    useState<number>(0);
  const [durationBasedEndTime, setDurationBasedEndTime] = useState<number>(0);
  const [quizIsSubmitted, setQuizIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [code, setCode] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQuestion = async () => {
      const questionsData = await getAllQuestionsOfQuiz(
        competition,
        quizId,
        language
      );
      if (questionsData) {
        const shuffledQuestions = shuffleArray([...questionsData]);
        setQuestions(shuffledQuestions);
      }
    };
    if (isQuizStart) {
      fetchQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizStart]);

  useSecurityProtection();
  const { FullscreenModal, showModal, enableFullScreen } =
    useFullscreenControl();
  const { isScreenshotAttempted } = useScreenshotProtection();

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

  const submitQuiz = async () => {
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
    try {
      if (competition === 'code-clash') {
        const response = await axios.post(
          `/api/submit-quiz/${competition}/${quizId}`,
          {
            userId,
            language,
            answers: selectedAnswers,
            timeSpent,
          }
        );
        if (response.status !== 200) {
          throw new Error('Quiz submission failed');
        }
      } else if (competition === 'bug-bash') {
        const response = await axios.post(
          `/api/submit-quiz/${competition}/${quizId}`,
          {
            userId,
            language,
            userSolutions: code,
            timeSpent,
          }
        );
        if (response.status !== 200) {
          throw new Error('Quiz submission failed');
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      localStorage.setItem('sbattxgninrawxahdraps', '5.5');
      localStorage.setItem('stnuocxhserferxgninrawxahdraps', '0');
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
  // useRefreshPrevent(submitQuiz);

  if (questions === null) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
        <FullscreenModal />
      </div>
    );
  }

  const goToQuestion = (index: number) => setCurrentQuestion(index);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers((prev: any) => {
      const questionId = questions[currentQuestion]._id;
      return prev[questionId] === optionIndex
        ? { ...prev, [questionId]: undefined }
        : { ...prev, [questionId]: optionIndex };
    });
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    setCurrentQuestion((prev) => {
      if (direction === 'prev' && prev > 0) return prev - 1;
      if (direction === 'next' && prev < questions.length - 1) return prev + 1;
      return prev;
    });
  };

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
                localStorage.setItem('wonxniegxtraxziuq', '0');
                window.open(
                  `/spardha/platform/results/${competition}/${quizId}`,
                  '_blank'
                );
                router.replace('/spardha'); // This will still redirect the current tab
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
      {isScreenshotAttempted && (
        <div className="relative my-20 h-screen w-full items-start justify-center">
          <Alert variant="destructive" className="z-[1200] w-full">
            <AlertTriangle className="size-5" />
            <AlertDescription className="text-lg font-semibold">
              Warning: Attempting to take screenshots or switch tabs or
              ExitFullScreenMode may result in automatic submission.
            </AlertDescription>
          </Alert>
        </div>
      )}
      {(competition === 'code-clash' || competition === 'bug-bash') && (
        <>
          <FullscreenModal />
          <div className="fixed inset-0 top-28 z-10 mx-auto mb-6 flex h-fit w-full items-center justify-between rounded-lg bg-white p-4 shadow-md dark:bg-navy-blue sm:top-14">
            <div>
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <QuizTimeLeft
              onTimeup={submitQuiz}
              quizEndTime={
                isDurationBased ? durationBasedEndTime : Number(endTime)
              }
              setIsQuizTimeEnd={setIsQuizTimeEnd}
            />
          </div>
          {tabWarnings >= 0 && (
            <div className="w-full pt-48 sm:pt-32">
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
          <div className="relative mx-auto flex max-w-full flex-col gap-2 sm:flex-row">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-h-[100vh] w-full flex-grow overflow-y-auto"
            >
              <Card>
                <CardContent>
                  {competition === 'code-clash' ? (
                    <>
                      <div className="mt-2 rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                        <div className="mt-4">
                          {renderFormattedText(
                            questions[currentQuestion].question,
                            language
                          )}
                        </div>
                      </div>

                      <div className="mt-2 w-full space-y-4 px-4">
                        {questions[currentQuestion].options.map(
                          (option: any, index: number) => (
                            <div
                              key={index}
                              className="z-[1200] flex items-center justify-start gap-2"
                              onClick={() => handleAnswerSelect(index)}
                            >
                              <span>
                                {index === 0
                                  ? 'a)'
                                  : index === 1
                                    ? 'b)'
                                    : index === 2
                                      ? 'c)'
                                      : 'd)'}
                              </span>
                              <Button
                                key={index}
                                className={`flex h-full w-full justify-start border-[1px] border-blue-grotto bg-white text-start text-base text-black hover:bg-green-200 active:scale-95 active:bg-green-200 dark:bg-gray-900 dark:text-white dark:hover:bg-green-300 ${
                                  selectedAnswers[
                                    questions[currentQuestion]._id
                                  ] === index
                                    ? 'bg-green-200 text-black dark:bg-green-300 dark:text-black'
                                    : ''
                                }`}
                              >
                                <span
                                  className="w-full"
                                  onClick={(e: any) => {
                                    handleAnswerSelect(index),
                                      e.stopPropagation();
                                  }}
                                >
                                  {renderFormattedText(option, language)}
                                </span>
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mt-2 rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                        <Tabs defaultValue="problem" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="problem">
                              Problem Statement
                            </TabsTrigger>
                            <TabsTrigger value="buggy-solution">
                              Buggy Solution
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="problem" className="max-w-2xl">
                            {questions[currentQuestion]?.question?.problem &&
                              renderFormattedText(
                                questions[currentQuestion].question.problem,
                                language
                              )}
                          </TabsContent>

                          <TabsContent value="buggy-solution">
                            {questions[currentQuestion]?.question
                              ?.buggySolution &&
                              renderFormattedText(
                                questions[currentQuestion].question
                                  .buggySolution,
                                language
                              )}
                          </TabsContent>
                        </Tabs>

                        <div className="mx-auto mt-4 flex w-full flex-col gap-2 text-start">
                          <h1 className="font-body text-lg text-black dark:text-white">
                            Write the bug-free code below
                          </h1>
                          <CodeEditor
                            width="100%"
                            height="80%"
                            initialLanguage={language}
                            initialCode={
                              code[questions[currentQuestion]._id] ??
                              questions[
                                currentQuestion
                              ].question.buggySolution.replace(
                                /<codeBlock>|<\/codeBlock>/g,
                                ''
                              )
                            }
                            onChange={(val: string) =>
                              setCode((prev) => ({
                                ...prev,
                                [questions[currentQuestion]._id]: val,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            <div className="overflow-y-auto rounded-lg bg-white p-4 shadow-md dark:bg-navy-blue">
              <h3 className="mb-2 text-lg font-bold">Questions</h3>
              {competition === 'code-clash' ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      className={`h-10 w-full rounded-md font-bold text-black dark:text-white ${
                        selectedAnswers[questions[index]._id] !== undefined
                          ? 'bg-green-300 hover:bg-green-400'
                          : 'bg-red-300 hover:bg-red-400'
                      } ${
                        currentQuestion === index &&
                        'border-[2px] border-blue-400'
                      } `}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {questions.map((question, index) => {
                    if (
                      code[question._id] ===
                      question.question.buggySolution.replace(
                        /<codeBlock>|<\/codeBlock>/g,
                        ''
                      )
                    ) {
                      setCode({ ...code, [question._id]: undefined });
                    }
                    return (
                      <Button
                        key={question._id} // Using _id as key for better performance
                        className={`h-10 w-full rounded-md font-bold text-black dark:text-white ${
                          code[question._id] !== undefined
                            ? code[question._id] !==
                              question.question.buggySolution.replace(
                                /<codeBlock>|<\/codeBlock>/g,
                                ''
                              )
                              ? 'bg-green-300 hover:bg-green-400'
                              : 'bg-red-300 hover:bg-red-400'
                            : 'bg-red-300 hover:bg-red-400'
                        } ${currentQuestion === index ? 'border-[2px] border-blue-400' : ''} `}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
              )}
              <div className="mt-6 flex flex-col justify-between gap-2">
                <Button
                  onClick={() => navigateQuestion('prev')}
                  disabled={currentQuestion === 0}
                  className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-700"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={() => submitQuiz()}
                    className="bg-green-500 px-4 py-2 text-white hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting' : 'Submit'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigateQuestion('next')}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Next <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SecureQuestionPage;
