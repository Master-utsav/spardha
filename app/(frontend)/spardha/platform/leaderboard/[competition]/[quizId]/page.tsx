'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const [attempt, setAttempt] = useState<number | null>(null);
  const params = useParams();
  const router = useRouter();

  return (
    <div className="container mx-auto flex flex-col items-center space-y-8 px-6 py-10">
      <h1 className="text-center text-3xl font-bold text-navy-blue dark:text-baby-blue md:text-4xl">
        Code Clash Leaderboard
      </h1>

      {/* Selection Inputs */}
      <div className="flex w-full max-w-md flex-col gap-4">
        {/* Attempt Number Select */}
        <Select onValueChange={(value) => setAttempt(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Attempt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Attempt 1</SelectItem>
            <SelectItem value="2">Attempt 2</SelectItem>
            <SelectItem value="3">Attempt 3</SelectItem>
            <SelectItem value="4">Attempt 4</SelectItem>
            <SelectItem value="5">Attempt 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Button */}
      <div className="flex w-full max-w-md justify-center">
        <Button
          disabled={attempt === null}
          onClick={() =>
            router.push(
              `/spardha/platform/leaderboard/${params['competition']}/${params['quizId']}/${attempt}`
            )
          }
          className="w-full px-6 py-2 md:w-auto"
        >
          View Attempt {attempt} Leaderboard
        </Button>
      </div>
    </div>
  );
}
