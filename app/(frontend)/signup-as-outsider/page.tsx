'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupOutsiderPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/register', {
        email: data.email.trim().toLowerCase(),
        username: data.username.trim().toLowerCase(),
        password: data.password.trim(),
        role: 'outsider',
      });

      if (!response.data.success) {
        setError(response.data.error || 'Registration failed');
      } else {
        setEmail(data.email);
        setShowOtpForm(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      router.push('/login?verified=true');
    } catch (error: any) {
      setOtpError(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-baby-blue/30 px-4 py-12 dark:bg-navy-blue/30 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold text-navy-blue dark:text-baby-blue">
              {showOtpForm ? 'Verify Your Email' : 'Create an Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {showOtpForm
                ? 'Enter the OTP sent to your email'
                : 'Sign up as an outsider to join our platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showOtpForm ? (
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
                    placeholder="Enter your email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
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
            ) : (
              <div className="space-y-4">
                {otpError && (
                  <Alert variant="destructive">
                    <AlertDescription>{otpError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Enter the 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={verifyOtp}
                  className="w-full bg-blue-grotto hover:bg-navy-blue"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                      Verifying
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-blue-grotto hover:underline"
              >
                Sign in
              </Link>
            </div>
            {!showOtpForm && (
              <div className="text-center text-sm">
                Are you a college student?{' '}
                <Link
                  href="/signup-as-college"
                  className="font-medium text-blue-grotto hover:underline"
                >
                  Sign up as college student
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
