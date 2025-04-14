import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getTimeInMs } from '@/lib/math';
import { getQuizIdDetails } from '@/app/(backend)/actions/getQuiz';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SecureQuestionPage from '@/components/competition/SecureQuestionPage';
import CompetitionNav from '@/components/competition/CompetitionNav';

export default async function BugBashQuizPage({
  params,
}: {
  params: { quizId: string; language: string };
}) {
  const data: any = await getQuizIdDetails('bug-bash', params.quizId);
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return <div>Not logged in</div>;
  }

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

  return (
    <section className="relative max-h-screen p-0">
      <CompetitionNav
        name={session.user.name ?? ''}
        emailOrEnrollment={
          (session.user.role === 'college'
            ? session.user.enrollmentNumber
            : session.user.role === 'outsider'
              ? session.user.email
              : 'guest') as string
        }
        language={params.language}
        quizId={params.quizId}
      />
      <main className="relative h-full w-full bg-baby-blue/30 dark:bg-navy-blue/30">
        <SecureQuestionPage
          competition="bug-bash"
          endTime={
            data.endTime ? getTimeInMs(data.endDate, data.endTime) : null
          }
          language={params.language}
          quizId={params.quizId}
          startTime={
            data.startTime ? getTimeInMs(data.startDate, data.startTime) : null
          }
          userId={session.user.id}
          duration={data.duration}
          isDurationBased={data.isDurationBased}
        />
      </main>
    </section>
  );
}
