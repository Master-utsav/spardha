'use client';

import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';

const AddTimeForQuiz = ({
  initialStartTime,
  initailStartDate,
  initialEndTime,
  initialEndDate,
  initailDuration,
}: {
  initialStartTime: string;
  initailStartDate: string;
  initialEndTime: string;
  initialEndDate: string;
  initailDuration: string;
}) => {
  const params = useParams();
  const [startDate, setStartDate] = useState(initailStartDate ?? '');
  const [startTime, setStartTime] = useState(initialStartTime ?? '');
  const [endDate, setEndDate] = useState(initialEndDate ?? '');
  const [endTime, setEndTime] = useState(initialEndTime ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [duration, setDuration] = useState(initailDuration || '00:00:00:00'); // Stored as "dd:hh:mm:ss"
  const [durationBased, setDurationBased] = useState<boolean>(false);

  const updateDuration = (value: string, index: number) => {
    let parts = duration.split(':');
    parts[index] = value.padStart(index === 0 ? 3 : 2, '0'); // Ensure proper padding
    setDuration(parts.join(':'));
  };

  // Generate options dynamically
  const generateOptions = (limit: number) =>
    Array.from({ length: limit }, (_, i) => i.toString().padStart(2, '0'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const data = durationBased
      ? { duration }
      : { startDate, startTime, endDate, endTime };

    try {
      const response = await axios.post(
        `/api/add-time/${params['competition']}/${params['quizId']}`,
        data
      );

      if (response.status === 200) {
        setMessage({ type: 'success', text: '✅ Timer added successfully!' });
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
      } else {
        setMessage({
          type: 'error',
          text: '❌ Failed to add timer. Try again.',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error saving timer.' });
    }

    setLoading(false);
  };

  return (
    <div className="flex w-full items-center justify-center bg-white pt-16 dark:bg-black">
      <Tabs
        defaultValue="Fixed-time-based"
        className="relative mx-auto max-w-7xl"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-300 dark:bg-gray-800">
          <TabsTrigger value="Fixed-time-based">Fixed Time Based</TabsTrigger>
          <TabsTrigger value="duration-based">Duration Based</TabsTrigger>
        </TabsList>
        <TabsContent value="Fixed-time-based">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add Timer</CardTitle>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert
                  variant={
                    message.type === 'success' ? 'default' : 'destructive'
                  }
                  className="mb-4"
                >
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">
                    Start Date (DD-MM-YYYY)
                  </label>
                  <Input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    placeholder="e.g. 12-03-2025"
                  />
                </div>

                <div>
                  <label className="block font-medium">
                    Start Time (HH:mm)
                  </label>
                  <Input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    placeholder="e.g. 13:00"
                  />
                </div>

                <div>
                  <label className="block font-medium">
                    End Date (DD-MM-YYYY)
                  </label>
                  <Input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    placeholder="e.g. 13-03-2025"
                  />
                </div>

                <div>
                  <label className="block font-medium">End Time (HH:mm)</label>
                  <Input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    placeholder="e.g. 15:00"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  onClick={() => setDurationBased(false)}
                >
                  {loading ? 'Saving...' : 'Save Timer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="duration-based">
          <Card className="relative mx-auto w-full max-w-md p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <CardContent className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Days', options: generateOptions(1000), index: 0 }, // Days (0-999)
                  { label: 'Hours', options: generateOptions(24), index: 1 }, // Hours (0-23)
                  { label: 'Minutes', options: generateOptions(60), index: 2 }, // Minutes (0-59)
                  { label: 'Seconds', options: generateOptions(60), index: 3 }, // Seconds (0-59)
                ].map(({ label, options, index }) => (
                  <div key={label} className="flex flex-col items-center">
                    <Label className="text-sm">{label}</Label>
                    <Select
                      onValueChange={(value) => updateDuration(value, index)}
                    >
                      <SelectTrigger className="w-20 text-center">
                        <SelectValue
                          placeholder={duration && duration.split(':')[index]}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={() => setDurationBased(true)}
              >
                {loading ? 'Saving...' : 'Save Timer'}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddTimeForQuiz;
