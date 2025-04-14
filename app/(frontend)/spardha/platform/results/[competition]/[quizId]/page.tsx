import ResultPage from '@/components/competition/ResultPage';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getAllQuestionsOfQuizForResult,
  getQuizIdDetails,
} from '@/app/(backend)/actions/getQuiz';
import { quizDetails } from '@/constants/interface';
import { getQuizResult } from '@/app/(backend)/actions/getResults';

export default async function ResultsPage({
  params,
}: {
  params: { competition: string; quizId: string };
}) {
  const session: Session | null = await getServerSession(authOptions);
  const quizDetails: any = await getQuizIdDetails(
    params.competition,
    params.quizId
  );
  const result: any = await getQuizResult(
    params.competition,
    params.quizId,
    String(session?.user.id)
  );

  if (!result || !quizDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
      </div>
    );
  }

  const questions = await getAllQuestionsOfQuizForResult(
    params.competition,
    params.quizId,
    result.language
  );
  // if (!questions || !quizDetails.isDurationBased) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
  //       <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-grotto"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-baby-blue/30 dark:bg-navy-blue/30">
      <ResultPage
        competition={params.competition}
        questions={questions}
        quizDetails={quizDetails}
        quizId={params.quizId}
        result={result}
      />
    </div>
  );
}
