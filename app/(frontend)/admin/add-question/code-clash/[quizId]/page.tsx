import { getQuizIdDetailsByAdmin } from '@/app/(backend)/actions/getQuiz';
import AddCodeClashQuestion from '@/components/admin/AddCodeClashQuestion';

export default async function AddQuizQuestion({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;
  const details = await getQuizIdDetailsByAdmin('code-clash', quizId);

  return <AddCodeClashQuestion details={details} />;
}
