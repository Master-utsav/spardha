'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Code, User } from 'lucide-react';
import Link from 'next/link';
import { quizDetails } from '@/constants/interface';
import { formatTimeDurationForString } from '@/lib/math';

const SelectCompetition = ({
  quizDetails,
  competition,
}: {
  quizDetails: quizDetails[];
  competition: string;
}) => {
  const headName =
    competition === 'code-clash'
      ? 'Quizzes'
      : competition === 'bug-bash'
        ? 'Buggy Quizzes'
        : 'Mirages';
  return (
    <div className="min-h-screen bg-baby-blue/30 pb-16 pt-24 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold">Available {headName}</h1>
          <p className="text-lg text-gray-600">
            Choose a quiz and test your skills.
          </p>
        </motion.div>

        {/* Grid layout for quiz cards */}
        <div className="container">
          <div className="grid grid-cols-1 gap-6">
            {quizDetails.map((quiz) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [showMore, setShowMore] = useState(false);
              const duration = formatTimeDurationForString(quiz.duration);
              return (
                <motion.div
                  key={quiz.quizId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="card">
                    <CardHeader className="card-header w-full flex-col sm:flex-row">
                      <div className="space-y-2">
                        <CardTitle className="card-title max-sm:text-center">
                          {quiz.quizName}
                        </CardTitle>
                        <CardDescription className="card-description max-w-xl max-sm:text-center">
                          {quiz.description}
                        </CardDescription>
                      </div>
                      <div className="card-author">
                        <User className="size-5" />
                        <span className="font-semibold">{quiz.authorName}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="card-content">
                      {/* Date & Time */}
                      {!quiz.isDurationBased ? (
                        <div className="card-datetime max-sm:items-start">
                          <div className="time">
                            <span className="font-semibold">Start on: </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-5 text-blue-grotto" />
                              {quiz.startDate} | {quiz.startTime}
                            </span>
                          </div>
                          <p className="duration max-md:hidden">
                            Duration: <strong>{duration}</strong>
                          </p>
                          <div className="time">
                            <span className="font-semibold">Ends on: </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-5 text-blue-grotto" />
                              {quiz.endDate} | {quiz.endTime}
                            </span>
                          </div>
                          <p className="duration md:hidden">
                            Duration: <strong>{duration}</strong>
                          </p>
                        </div>
                      ) : (
                        <p className="duration">
                          Duration: <strong>{duration}</strong>
                        </p>
                      )}

                      {/* Languages */}
                      <div className="card-languages">
                        {' '}
                        <span className="flex flex-col items-center justify-center gap-1 sm:flex-row">
                          <Code className="size-3 max-sm:hidden" /> Languages:
                          <code className="rounded-sm bg-gray-200 px-1 font-mono text-red-500 dark:bg-gray-800">
                            {quiz.languages.join(', ')}
                          </code>
                        </span>
                      </div>

                      {/* Rules */}
                      <div className="card-rules">
                        <p className="font-semibold">Key Rules:</p>
                        <ul>
                          {quiz.rules
                            .slice(0, showMore ? quiz.rules.length : 3)
                            .map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                        </ul>
                        <button
                          className="read-more"
                          onClick={() => setShowMore(!showMore)}
                        >
                          {showMore ? 'Show Less' : 'Read More'}
                        </button>
                      </div>

                      {/* Start Button */}
                      <div className="start-btn">
                        <Button asChild>
                          <Link
                            href={`/spardha/platform/${competition}/${quiz.quizId}`}
                          >
                            View Quiz Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCompetition;
