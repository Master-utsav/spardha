import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getAllQuizDetails } from '@/app/(backend)/actions/getQuiz';
import SelectCompetition from '@/components/competition/SelectCompetition';
import { NewEnrollmentInterface, quizDetails } from '@/constants/interface';

export default async function CompetitionPage({
  params,
}: {
  params: { competition: string };
}) {
  const quizDetails: quizDetails[] = await getAllQuizDetails(
    params.competition
  );

  if (!quizDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
      </div>
    );
  }

  if (
    !(
      params.competition === 'code-clash' ||
      params.competition === 'bug-bash' ||
      params.competition === 'code-mirage'
    )
  ) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center">
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
        <SelectCompetition
          competition={params.competition}
          quizDetails={quizDetails}
        />
      </main>
    </>
  );
}
