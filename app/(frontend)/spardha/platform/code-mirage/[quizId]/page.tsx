import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getQuizIdDetails } from '@/app/(backend)/actions/getQuiz';
import QuizDetailsPage from '@/components/competition/QuizDetailsPage';
import { getUserEnrolledInData } from '@/app/(backend)/actions/getUser';

export default async function CompetitionPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quizDetailsAsId = await getQuizIdDetails('code-mirage', params.quizId);
  const enrolledInData = await getUserEnrolledInData(
    'code-mirage',
    params.quizId
  );

  if (!quizDetailsAsId) {
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
    <>
      <Navbar />
      <main className="w-full flex-grow">
        <QuizDetailsPage
          details={quizDetailsAsId}
          competition="code-mirage"
          isEnrolled={enrolledInData?.enrolledIn?.isEnrolled ?? false}
        />
      </main>
    </>
  );
}
