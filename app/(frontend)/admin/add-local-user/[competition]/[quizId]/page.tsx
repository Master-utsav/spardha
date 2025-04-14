'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  enrollmentNumber: z.string().min(5, 'Enrollment number is required'),
  semester: z.string().min(1, 'Semester is required'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function AddLocalUserAdminPage({
  params,
}: {
  params: { competition: string; quizId: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);
    console.log(data.email, data.email, data.enrollmentNumber, data.username);
    try {
      const res = await axios.post(
        `/api/add-local-user/${params.competition}/${params.quizId}`,
        {
          email: data.email.trim().toLowerCase(),
          username: data.username.trim().toLowerCase(),
          enrollmentNumber: data.enrollmentNumber.trim(),
          semester: data.semester,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        setMessage({ type: 'success', text: '✅ User added successfully' });
      }
    } catch (error: any) {
      setError(error.res?.data?.error || 'Registration failed');
      setMessage({
        type: 'error',
        text: `❌ ${error.res?.data?.error || 'Registration failed'}`,
      });
    } finally {
      setIsLoading(false);
      setValue('email', '');
      setValue('enrollmentNumber', '');
      setValue('username', '');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-baby-blue/30 px-4 py-12 dark:bg-navy-blue/30 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold text-navy-blue dark:text-baby-blue">
              {'Create a Token Based User'}
            </CardTitle>
            <CardDescription className="text-center capitalize">
              Create a college based student to join quiz{' '}
              {params.quizId.replaceAll('-', ' ')}
            </CardDescription>
          </CardHeader>
          {message && (
            <Alert
              variant={message.type === 'success' ? 'default' : 'destructive'}
              className="mb-4"
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your college email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  placeholder="Enter your enrollment number"
                  {...register('enrollmentNumber')}
                />
                {errors.enrollmentNumber && (
                  <p className="text-sm text-red-500">
                    {errors.enrollmentNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  onValueChange={(value) => setValue('semester', value)}
                  defaultValue=""
                >
                  <SelectTrigger id="semester" className="w-full">
                    <SelectValue placeholder="Select your semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semester && (
                  <p className="text-sm text-red-500">
                    {errors.semester.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-grotto hover:bg-navy-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
