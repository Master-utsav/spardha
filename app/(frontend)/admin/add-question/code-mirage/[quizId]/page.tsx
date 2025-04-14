import { getQuizIdDetailsByAdmin } from '@/app/(backend)/actions/getQuiz';
import AddCodeMirageQuestion from '@/components/admin/AddCodeMirageQuestion';

export default async function AddCodeMirageQuestionPage({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;
  const details = await getQuizIdDetailsByAdmin('code-mirage', quizId);

  return <AddCodeMirageQuestion details={details} />;
}
