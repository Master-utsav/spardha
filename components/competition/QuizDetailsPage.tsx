'use client';

import { quizDetails } from '@/constants/interface';
import { motion } from 'framer-motion';
import { Clock, Trophy, Code, IndianRupee, Bug } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { formatDuration, formatTimeDurationForString } from '@/lib/math';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import Link from 'next/link';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const QuizDetailsPage = ({
  details,
  competition,
  isEnrolled,
}: {
  details: any;
  competition: string;
  isEnrolled: boolean;
}) => {
  const { toast } = useToast();

  const handleEnrollButton = async () => {
    const quizId = details.quizId;
    const competitionId = competition;

    try {
      const res = await axios.post(
        `/api/set-enroll/${competitionId}/${quizId}`
      );

      if (res?.data?.success) {
        toast({
          title: 'Enrolled Successfully',
          description: 'You have been enrolled in the quiz.',
          variant: 'default',
          duration: 3000,
        });
      } else {
        console.log('Server Response Error:', res.data);
        throw new Error(res.data?.error || 'Unexpected error occurred');
      }
    } catch (error: any) {
      console.error('Enrollment Error:', error);
      const errorMessage =
        error.response?.data?.error || error.message || 'Something went wrong';

      toast({
        title: 'Failed to enroll',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleStartNow = () => {
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
    setTimeout(() => {
      window.open(
        `/spardha/platform/${competition}/${details.quizId}/start`,
        '_blank'
      );
    }, 10);
  };

  return (
    <div className="min-h-screen bg-baby-blue/30 pb-16 pt-24 dark:bg-navy-blue/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center">
            {competition === 'code-clash' ? (
              <Code className="size-10 text-blue-grotto" />
            ) : competition === 'bug-bash' ? (
              <Bug className="size-10 text-blue-grotto" />
            ) : (
              <Code className="size-10 text-blue-grotto" />
            )}
          </div>
          <h1 className="text-3xl font-bold">{details.quizName}</h1>
          <p className="mx-auto max-w-xl text-center text-lg text-gray-600">
            {details.description}
          </p>
        </motion.div>

        <Tabs defaultValue="overview" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="winning-prize">Winning Prize</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Competition Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex flex-col items-center rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                    <Clock className="mb-2 h-8 w-8 text-blue-grotto" />
                    <h3 className="font-semibold">Duration</h3>
                    <p className="font-bold text-gray-600 dark:text-gray-400">
                      {formatTimeDurationForString(details.duration)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                    <Trophy className="mb-2 h-8 w-8 text-blue-grotto" />
                    <h3 className="font-semibold">Difficulty</h3>
                    <p className="font-bold capitalize text-gray-600 dark:text-gray-400">
                      {details.difficulty}
                    </p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-white p-4 dark:bg-navy-blue/50">
                    <Code className="size-10 text-blue-grotto" />
                    <h3 className="font-semibold">Languages</h3>
                    <code className="rounded-sm text-center font-mono">
                      {details.languages.join(', ')}
                    </code>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {details.description}
                  </p>
                </div>

                <div
                  className={`flex ${
                    details.isDurationBased
                      ? 'sm:justify-end'
                      : 'sm:justify-between'
                  } mt-6 w-full items-center justify-center gap-2 max-sm:flex-col sm:items-end`}
                >
                  {!details.isDurationBased && (
                    <div className="card-datetime flex-col items-start justify-between gap-3">
                      <div className="time">
                        <span className="font-semibold">Start on: </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-5 text-blue-grotto" />
                          {details.startDate} | {details.startTime}
                        </span>
                      </div>

                      <div className="time">
                        <span className="font-semibold">Ends on: </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-5 text-blue-grotto" />
                          {details.endDate} | {details.endTime}
                        </span>
                      </div>
                    </div>
                  )}
                  {isEnrolled ? (
                    details.event !== 'code-mirage' ? (
                      <Link
                        href={`/spardha/platform/${competition}/${details.quizId}/choose-language/`}
                        target="_blank"
                      >
                        <Button className="bg-blue-grotto text-white hover:bg-navy-blue">
                          Select Language
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="bg-blue-grotto text-white hover:bg-navy-blue"
                        onClick={handleStartNow}
                      >
                        Start Now
                      </Button>
                    )
                  ) : (
                    <Button
                      className="bg-blue-grotto text-white hover:bg-navy-blue"
                      onClick={handleEnrollButton}
                    >
                      Enroll Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winning-prize">
            <Card>
              <CardHeader>
                <CardTitle>Entry Fee and Prize Money</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full flex-col items-center justify-between gap-2 rounded-lg p-2 font-bold sm:flex-row sm:items-start sm:gap-4 lg:p-4">
                  <div className="flex flex-col items-start justify-center gap-1">
                    <span className="flex items-center gap-1 text-2xl font-bold text-yellow-400 lg:gap-3">
                      <Trophy className="size-6 text-yellow-500" />
                      <span className="flex items-center justify-center bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                        <IndianRupee className="size-5 text-yellow-300" />{' '}
                        {details.prizeMoney[0]}
                      </span>
                      <span className="text-sm text-gray-300">(1st Place)</span>
                    </span>

                    <span className="flex items-center gap-1 text-xl font-semibold text-gray-400 lg:gap-3">
                      <Trophy className="size-5 text-gray-400" />
                      <span className="flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                        <IndianRupee className="size-4 text-gray-300" />{' '}
                        {details.prizeMoney[1]}
                      </span>
                      <span className="text-sm text-gray-300">(2nd Place)</span>
                    </span>

                    <span className="flex items-center gap-1 text-lg font-medium text-orange-300 lg:gap-3">
                      <Trophy className="size-4 text-orange-300" />
                      <span className="flex items-center justify-center bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                        <IndianRupee className="size-3 text-orange-300" />{' '}
                        {details.prizeMoney[2]}
                      </span>
                      <span className="text-sm text-gray-300">(3rd Place)</span>
                    </span>
                  </div>

                  <span className="flex items-center gap-1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Entry Fee: {details.entryFee} INR
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Competition Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {details.rules.map((rule: any, index: number) => (
                    <li
                      key={index}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Link
                  href={`/spardha/platform/leaderboard/${competition}/${details.quizId}`}
                  target="_blank"
                  className="rounded-md bg-blue-grotto px-2 py-3 text-center text-white"
                >
                  LeaderBoard
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizDetailsPage;
