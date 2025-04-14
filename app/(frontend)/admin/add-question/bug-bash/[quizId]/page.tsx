import { getQuizIdDetailsByAdmin } from '@/app/(backend)/actions/getQuiz';
import AddBugBashQuestionDetails from '@/components/admin/AddBugBashQuestionDetails';

export default async function AddBugBashQuestion({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;
  const details = await getQuizIdDetailsByAdmin('bug-bash', quizId);

  return <AddBugBashQuestionDetails details={details} />;
}
