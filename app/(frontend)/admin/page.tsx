'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const labels = [
  { label: 'Code Clash', value: 'code-clash' },
  { label: 'Bug Bash', value: 'bug-bash' },
  { label: 'Code Mirage', value: 'code-mirage' },
];

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedLabel, setSelectedLabel] = useState('code-clash');
  const [quizId, setQuizId] = useState('');

  return (
    <>
      <h1 className="py-5 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Welcome, Chief {session?.user?.name || 'Admin'}!
      </h1>
      <div className="relative mx-auto flex h-full max-w-full flex-wrap items-start justify-center gap-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        {/* Add Quiz Section */}
        <div className="flex h-full w-fit flex-col gap-1 rounded-lg border bg-gray-100 p-2 shadow-md dark:bg-gray-800">
          <Label>Select Event for Quiz</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="mt-1 w-full text-white"
            onClick={() => router.push(`/admin/add-quiz/${selectedLabel}`)}
          >
            Add Quiz
          </Button>
        </div>

        {/* Add Questions Section */}
        <div className="flex w-fit flex-col gap-1 rounded-lg border bg-gray-100 p-2 shadow-md dark:bg-gray-800">
          <Label>Add Event Questions</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="mt-2"
            placeholder="Enter Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <Button
            className="mt-1 w-full text-white"
            onClick={() =>
              quizId &&
              router.push(`/admin/add-question/${selectedLabel}/${quizId}`)
            }
          >
            Add Questions
          </Button>
        </div>

        {/* Add Time Section */}
        <div className="flex w-fit flex-col gap-1 rounded-lg border bg-gray-100 p-2 shadow-md dark:bg-gray-800">
          <Label>Update Event Timing</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="mt-2"
            placeholder="Enter Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <Button
            className="mt-1 w-full text-white"
            onClick={() =>
              quizId &&
              router.push(`/admin/add-time/${selectedLabel}/${quizId}`)
            }
          >
            Update Time
          </Button>
        </div>

        {/* update quiz details */}
        <div className="flex w-fit flex-col gap-1 rounded-lg border bg-gray-100 p-2 shadow-md dark:bg-gray-800">
          <Label>Update your Quiz</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="mt-2"
            placeholder="Enter Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <Button
            className="mt-1 w-full text-white"
            onClick={() =>
              router.push(`/admin/update-quiz/${selectedLabel}/${quizId}`)
            }
          >
            Update Quiz Details
          </Button>
        </div>

        {/* update quiz questions */}
        <div className="flex w-fit flex-col gap-1 rounded-lg border bg-gray-100 p-2 shadow-md dark:bg-gray-800">
          <Label>Update Quiz Questions</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="mt-2"
            placeholder="Enter Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <Button
            className="mt-1 w-full text-white"
            onClick={() =>
              router.push(`/admin/update-questions/${selectedLabel}/${quizId}`)
            }
          >
            Update Quiz Questions
          </Button>
        </div>

        {/* Add User as Local */}
        <div className="flex w-fit flex-col gap-1 rounded-lg border bg-gray-100 p-2 shadow-md dark:bg-gray-800">
          <Label>Add Local user Token based</Label>
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="mt-2"
            placeholder="Enter Quiz ID"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          />
          <Button
            className="mt-1 w-full text-white"
            onClick={() =>
              router.push(`/admin/add-local-user/${selectedLabel}/${quizId}`)
            }
          >
            Generate User Token
          </Button>
        </div>
      </div>
    </>
  );
}
