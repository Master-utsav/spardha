import { getLeaderBoardResult } from '@/app/(backend)/actions/getResults';
import { Button } from '@/components/ui/button';
import {
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  Table,
} from '@/components/ui/table';
import { formatTime } from '@/lib/math';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function LeaderBoardAttemptBased({
  params,
}: {
  params: {
    competition: string;
    quizId: string;
    attempt: number;
  };
}) {
  const leaderboard = await getLeaderBoardResult(
    params.competition,
    params.quizId,
    params.attempt
  );

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center space-y-8 px-6 py-10">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-2 overflow-x-auto rounded-lg border border-gray-300 shadow-lg dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-200 dark:bg-gray-900">
              <TableRow>
                <TableHead className="px-4 py-3 text-left">Name</TableHead>
                <TableHead className="px-4 py-3 text-left">
                  Email/Enrollment
                </TableHead>
                <TableHead className="px-4 py-3 text-left">
                  College Student
                </TableHead>
                <TableHead className="px-4 py-3 text-left">Language</TableHead>
                <TableHead className="px-4 py-3 text-left">
                  Time Spent
                </TableHead>
                <TableHead className="px-4 py-3 text-left">Score</TableHead>
                <TableHead className="px-4 py-3 text-left">Attempt</TableHead>
              </TableRow>
            </TableHeader>
          </Table>

          <span className="block py-6 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">
            Leaderboard not found
          </span>
        </div>

        {/* Back to Dashboard Button */}
        <Link href="/spardha" target="_blank">
          <Button className="transform rounded-lg bg-blue-grotto px-6 py-3 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-navy-blue">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center space-y-8 px-6 py-10">
      {leaderboard.length > 0 && (
        <div className="w-full max-w-5xl overflow-x-auto rounded-lg border border-gray-300 shadow-lg dark:border-gray-700">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-200 dark:bg-gray-900">
              <TableRow>
                <TableHead className="px-4 py-3 text-left">Name</TableHead>
                <TableHead className="px-4 py-3 text-left">
                  Email/Enrollment
                </TableHead>
                <TableHead className="px-4 py-3 text-left">
                  College Student
                </TableHead>
                <TableHead className="px-4 py-3 text-left">Language</TableHead>
                <TableHead className="px-4 py-3 text-left">
                  Time Spent
                </TableHead>
                <TableHead className="px-4 py-3 text-left">Score</TableHead>
                {params.competition === 'code-mirage' && (
                  <TableHead className="px-4 py-3 text-left">Checked</TableHead>
                )}
                <TableHead className="px-4 py-3 text-left">Attempt</TableHead>
                {params.competition === 'code-mirage' && (
                  <TableHead className="px-4 py-3 text-left">
                    view page
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map(
                (entry: any, index: number) =>
                  (entry.enrollmentNumber || entry.email) && (
                    <TableRow
                      key={entry.email + index}
                      className={`${
                        index % 2 === 0
                          ? 'bg-gray-50 dark:bg-gray-800'
                          : 'bg-white dark:bg-gray-900'
                      } transition hover:bg-gray-100 dark:hover:bg-gray-700`}
                    >
                      {/* Name */}
                      <TableCell className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">
                        {entry.name}
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {entry.isCollegeStudent
                          ? entry.enrollmentNumber
                          : entry.email}
                      </TableCell>

                      {/* College Student Chip */}
                      <TableCell className="px-4 py-3">
                        <div
                          className={`w-fit rounded-lg px-3 py-1 text-xs font-semibold ${
                            entry.isCollegeStudent
                              ? 'border-[1px] border-green-500 bg-green-500/20 text-green-500'
                              : 'border-[1px] border-red-500 bg-red-500/20 text-red-500'
                          }`}
                        >
                          <span>{entry.isCollegeStudent ? 'Yes' : 'No'}</span>
                        </div>
                      </TableCell>

                      {/* Language */}
                      <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        <span
                          className={`${
                            index % 2 === 0
                              ? 'bg-gray-50 dark:bg-gray-900'
                              : 'bg-white dark:bg-gray-800'
                          } rounded-sm bg-gray-300 px-2 py-1 font-mono font-semibold capitalize text-red-500 transition hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          {params.competition !== 'code-mirage'
                            ? entry.language
                            : 'HTML & CSS'}
                        </span>
                      </TableCell>

                      {/* Time Spent */}
                      <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {formatTime(entry.timeSpent)}
                      </TableCell>

                      {/* Score */}
                      <TableCell className="px-4 py-3 text-lg font-bold text-blue-600 dark:text-blue-400">
                        {entry.score}
                      </TableCell>
                      {params.competition === 'code-mirage' && (
                        <TableCell className="px-4 py-3 text-lg font-bold text-blue-600 dark:text-blue-400">
                          <div
                            className={`w-fit rounded-lg px-3 py-1 text-xs font-semibold ${
                              entry.isScored
                                ? 'border-[1px] border-green-500 bg-green-500/20 text-green-500'
                                : 'border-[1px] border-red-500 bg-red-500/20 text-red-500'
                            }`}
                          >
                            <span>{entry.isScored ? 'Yes' : 'No'}</span>
                          </div>
                        </TableCell>
                      )}
                      {/* Attempt */}
                      <TableCell className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                        {params.attempt}
                      </TableCell>
                      {params.competition === 'code-mirage' && (
                        <TableCell className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                          <Link
                            href={`/preview-pages/code-mirage-ui-pages/${entry.uniqueId}`}
                            target="_blank"
                          >
                            <Eye className="hover:text-blue-grotto" />
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Back Button */}
      <Link href="/spardha" target="_blank">
        <Button className="transform rounded-lg bg-blue-grotto px-6 py-3 font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-navy-blue">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
