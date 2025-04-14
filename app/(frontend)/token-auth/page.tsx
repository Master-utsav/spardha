'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import useScreenshotProtection from '@/hooks/useScreenshotProtection';
import useFullscreenControl from '@/hooks/useFullscreenControl';
import useSecurityProtection from '@/hooks/useSecurityPolicy';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface TokenAuthForm {
  token: string;
  competition: string;
}

const TokenAuthPage = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<TokenAuthForm>({
    defaultValues: {
      competition: 'code-clash',
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: TokenAuthForm) => {
    setError(null);
    setIsLoading(true);
    const result = await signIn('credentials', {
      token: data.token,
      competition: data.competition,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      try {
        const res = await axios.get(`/api/getUserTokenDetail/${data.token}`);

        if (!res.data.success) {
          setError(res.data.error);
        }
        if (data.competition === 'code-mirage') {
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
        }

        const tokenFor = res.data.tokenFor;
        {
          data.competition === 'code-clash' || data.competition === 'bug-bash'
            ? router.replace(
                `/spardha/platform/${data.competition}/${tokenFor}/choose-language`
              )
            : router.replace(
                `/spardha/platform/${data.competition}/${tokenFor}/start`
              );
        }
      } catch (error: any) {
        setError(error.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const { isScreenshotAttempted } = useScreenshotProtection();
  useSecurityProtection();
  const { FullscreenModal } = useFullscreenControl();

  return (
    <div className="flex min-h-screen items-center justify-center bg-baby-blue/30 px-4 py-12 dark:bg-navy-blue/30 sm:px-6 lg:px-8">
      {isScreenshotAttempted && (
        <Alert variant="destructive" className="z-[1200] w-full">
          <AlertTriangle className="size-5" />
          <AlertDescription className="text-lg font-semibold">
            Warning: Attempting to take screenshots or switch tabs or
            ExitFullScreenMode may result in automatic submission.
          </AlertDescription>
        </Alert>
      )}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md transition dark:bg-gray-900">
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          Token Authentication
        </h2>

        {error && <p className="mt-2 text-center text-red-500">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Token
            </label>
            <input
              type="password"
              {...register('token', { required: 'Token is required' })}
              className="mt-1 w-full rounded border border-gray-400 bg-gray-100 px-3 py-2 text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            />
            {errors.token && (
              <p className="text-sm text-red-500">{errors.token.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Competition
            </label>
            <Select
              onValueChange={(value) => setValue('competition', value)}
              defaultValue="code-clash"
            >
              <SelectTrigger className="w-full rounded border border-gray-400 bg-gray-100 text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Select a competition" />
              </SelectTrigger>
              <SelectContent className="rounded-md border border-gray-400 bg-gray-100 text-gray-900 shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
                <SelectItem value="code-clash">Code Clash</SelectItem>
                <SelectItem value="bug-bash">Bug Bash</SelectItem>
                <SelectItem value="code-mirage">Code Mirage</SelectItem>
              </SelectContent>
            </Select>
            {errors.competition && (
              <p className="text-sm text-red-500">
                {errors.competition.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-center text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating' : 'Authenticate'}
          </Button>
        </form>
      </div>
      <FullscreenModal />
    </div>
  );
};

export default TokenAuthPage;
