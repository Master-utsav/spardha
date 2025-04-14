'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Award, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatTime, getTimeInMs } from '@/lib/math';
import { quizDetails } from '@/constants/interface';
import QuizTimeLeft from './QuizTimeLeft';
import { useEffect, useState } from 'react';
import { renderFormattedText } from '@/lib/parsedText';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ResultPage = ({
  result,
  quizDetails,
  quizId,
  competition,
  questions,
}: {
  result: any;
  quizDetails: quizDetails;
  quizId: string;
  competition: string;
  questions: any;
}) => {
  const [isQuizTimeEnd, setIsQuizTimeEnd] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!quizDetails.isDurationBased) {
      const currentTimeMS =
        new Date().getTime() -
        (process.env.NODE_ENV! !== 'development'
          ? new Date().getTimezoneOffset() * 60000
          : 0);

      const timeLeftInSeconds = Math.max(
        (getTimeInMs(quizDetails.endDate, quizDetails.endTime) -
          currentTimeMS) /
          1000,
        0
      );

      if (timeLeftInSeconds <= 0) {
        setIsQuizTimeEnd(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-baby-blue/30 pb-16 pt-24 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-navy-blue dark:text-baby-blue">
                Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {(competition === 'code-clash' ||
                  competition === 'bug-bash') && (
                  <div className="flex flex-col items-center rounded-lg bg-white p-6 dark:bg-navy-blue/50">
                    <Trophy className="mb-4 h-12 w-12 text-blue-grotto" />
                    <h3 className="text-2xl font-bold text-navy-blue dark:text-baby-blue">
                      {result.score}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Final Score
                    </p>
                  </div>
                )}
                {competition === 'code-mirage' && (
                  <Link
                    href={`/preview-pages/code-mirage-ui-pages/${result.uniqueId}`}
                    target="_blank"
                    className="flex flex-col items-center rounded-lg bg-white p-6 dark:bg-navy-blue/50"
                  >
                    <Eye className="mb-4 h-12 w-12 text-blue-grotto" />
                    <h3 className="text-2xl font-bold text-navy-blue dark:text-baby-blue">
                      View Page
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Page you created...
                    </p>
                  </Link>
                )}

                <div className="flex flex-col items-center rounded-lg bg-white p-6 dark:bg-navy-blue/50">
                  <Clock className="mb-4 h-12 w-12 text-blue-grotto" />
                  <h3 className="text-2xl font-bold text-navy-blue dark:text-baby-blue">
                    {formatTime(result.timeSpent)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Time Taken</p>
                </div>

                <div className="flex flex-col items-center rounded-lg bg-white p-6 dark:bg-navy-blue/50">
                  <Award className="mb-4 h-12 w-12 text-blue-grotto" />
                  <h3 className="text-2xl font-bold text-navy-blue dark:text-baby-blue">
                    {'HTML & CSS'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Language</p>
                </div>
              </div>

              {!quizDetails.isDurationBased || !isQuizTimeEnd ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-bold text-navy-blue dark:text-baby-blue">
                    Solution will be avialable in :{' '}
                  </span>
                  <QuizTimeLeft
                    onTimeup={() => {
                      setIsQuizTimeEnd(true);
                    }}
                    quizEndTime={
                      quizDetails.isDurationBased
                        ? 0
                        : Number(
                            getTimeInMs(
                              quizDetails.endDate,
                              quizDetails.endTime
                            )
                          )
                    }
                    setIsQuizTimeEnd={setIsQuizTimeEnd}
                  />
                </div>
              ) : null}

              {(isQuizTimeEnd || quizDetails.isDurationBased) &&
                (competition === 'code-clash' ? (
                  <div className="mx-auto max-w-3xl space-y-6">
                    {questions &&
                      questions.map((q: any, index: number) => {
                        const userAnswer = result.answers[String(q._id)];
                        const isCorrect =
                          userAnswer !== undefined &&
                          userAnswer === q.correctAnswer;
                        const isAttempted = userAnswer !== undefined;

                        return (
                          <Card
                            key={q._id}
                            className="relative border border-gray-700"
                          >
                            {/* Marks Indicator at Top Right */}
                            {isAttempted ? (
                              <div
                                className={`absolute right-2 top-2 rounded-lg px-3 py-1 text-sm font-bold ${
                                  isCorrect
                                    ? 'border-[1px] border-green-600 bg-green-600/40 text-green-600'
                                    : 'border-[1px] border-red-600 bg-red-600/40 text-red-600'
                                }`}
                              >
                                {isCorrect
                                  ? `+${q.marks}`
                                  : `-${q.negativeMarks}`}
                              </div>
                            ) : (
                              <div
                                className={`absolute right-2 top-2 rounded-lg border-[1px] border-gray-400 bg-gray-400/40 px-3 py-1 text-sm font-bold text-black dark:border-gray-800 dark:bg-gray-800/40 dark:text-white`}
                              >
                                +0.0
                              </div>
                            )}

                            <CardHeader>
                              <CardTitle className="text-lg">
                                {index + 1}.{' '}
                                {renderFormattedText(q.question, q.language)}
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                              {q.options.map(
                                (option: any, optIndex: number) => {
                                  const isSelected = userAnswer === optIndex;
                                  const isCorrectOption =
                                    q.correctAnswer === optIndex;

                                  return (
                                    <div
                                      key={optIndex}
                                      className={`flex items-center gap-2 rounded-lg border p-3 ${
                                        isSelected
                                          ? isCorrect
                                            ? 'border-green-500 bg-green-100 text-black dark:bg-green-200'
                                            : 'border-red-500 bg-red-100 text-black dark:bg-red-200'
                                          : 'border-gray-300 bg-gray-100 text-black dark:bg-gray-900 dark:text-white'
                                      }`}
                                    >
                                      {/* Icon for Correct / Incorrect Answer */}
                                      {isSelected ? (
                                        isCorrect ? (
                                          <CheckCircle className="text-green-600" />
                                        ) : (
                                          <XCircle className="text-red-600" />
                                        )
                                      ) : isCorrectOption ? (
                                        <CheckCircle className="text-green-500" />
                                      ) : (
                                        <div className="w-5" /> // Placeholder for alignment
                                      )}

                                      {/* Answer Text */}

                                      {renderFormattedText(option, q.language)}
                                    </div>
                                  );
                                }
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                ) : competition === 'bug-bash' ? (
                  <div className="mx-auto max-w-3xl space-y-6">
                    {questions &&
                      questions.map((q: any, index: number) => {
                        const userAnswer = result.userSolutions[String(q._id)];
                        const correctSolutionData =
                          result.correctnessReview.filter(
                            (sol: { questionId: string }) =>
                              sol.questionId === String(q._id)
                          );
                        const isCorrect =
                          correctSolutionData && correctSolutionData.length > 0
                            ? correctSolutionData[0].isCorrect
                            : undefined;

                        const isAttempted = userAnswer !== undefined;

                        return (
                          <Card
                            key={q._id}
                            className="relative border border-gray-700"
                          >
                            {/* Marks Indicator at Top Right */}
                            {isAttempted ? (
                              <div
                                className={`absolute right-2 top-2 rounded-lg px-3 py-1 text-sm font-bold ${
                                  isCorrect
                                    ? 'border-[1px] border-green-600 bg-green-600/20 text-green-600'
                                    : 'border-[1px] border-red-600 bg-red-600/20 text-red-600'
                                }`}
                              >
                                {isCorrect
                                  ? `+${q.marks}`
                                  : `-${q.negativeMarks}`}
                              </div>
                            ) : (
                              <div
                                className={`absolute right-2 top-2 rounded-lg border-[1px] border-gray-400 bg-gray-400/40 px-3 py-1 text-sm font-bold text-black dark:border-gray-800 dark:bg-gray-800/40 dark:text-white`}
                              >
                                +0.0
                              </div>
                            )}

                            <CardHeader>
                              <CardTitle className="text-lg">
                                {index + 1}.{' '}
                                {renderFormattedText(
                                  q.question.problem,
                                  q.language
                                )}
                                {renderFormattedText(
                                  q.question.buggySolution,
                                  q.language
                                )}
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2">
                              <p className="py-1 font-bold">Your Solution :</p>
                              {userAnswer !== undefined ? (
                                renderFormattedText(
                                  '<codeBlock>' + userAnswer + '</codeBlock>',
                                  q.language
                                )
                              ) : (
                                <div className="flex w-full items-center justify-center rounded-md border-[1px] border-gray-500 font-heading text-lg text-red-400">
                                  Not Attempted
                                </div>
                              )}
                              <p className="py-1 font-bold">
                                Correct Solution :
                              </p>
                              {renderFormattedText(
                                q.correctSolution,
                                q.language
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                ) : null)}

              <div className="mt-8 flex items-center justify-center gap-2 text-center">
                <Button
                  className="bg-blue-grotto hover:bg-navy-blue"
                  onClick={() => router.push('/spardha')}
                >
                  Back to Dashboard
                </Button>

                <Button
                  className="bg-blue-grotto hover:bg-navy-blue"
                  onClick={() =>
                    router.push(
                      `/spardha/platform/leaderboard/${competition}/${quizId}`
                    )
                  }
                >
                  LeaderBoard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
