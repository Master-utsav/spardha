import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getQuizIdDetails } from '@/app/(backend)/actions/getQuiz';
import { getTimeInMs } from '@/lib/math';
import ChooseQuizLanguage from '@/components/competition/ChooseQuizLanguage';

export default async function ChooseLanguagePageCodeClash({
  params,
}: {
  params: { quizId: string };
}) {
  const data: any = await getQuizIdDetails('code-clash', params.quizId);

  if (!data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Competition not found. Please select a valid competition from the
            Spardha page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const languages: string[] = data.languages;

  return (
    <div className="relative min-h-screen w-full bg-baby-blue/30 pb-16 pt-24 dark:bg-navy-blue/30">
      <ChooseQuizLanguage
        startTime={
          data.startTime ? getTimeInMs(data.startDate, data.startTime) : null
        }
        endTime={data.endTime ? getTimeInMs(data.endDate, data.endTime) : null}
        languages={languages}
        quizId={data.quizId}
        rules={data.rules}
        isDurationBased={data.isDurationBased}
        duration={data.duration}
        competition="code-clash"
      />
    </div>
  );
}
