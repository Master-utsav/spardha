import { getQuizIdDetails } from '@/app/(backend)/actions/getQuiz';
import AddTimeForQuiz from '@/components/admin/AddTimeForQiuiz';

export default async function AddTimerPage({
  params,
}: {
  params: { competition: string; quizId: string };
}) {
  const data: any = await getQuizIdDetails(params.competition, params.quizId);

  if (!data) {
    return (
      <div className="flex w-full items-center justify-center">
        <h1 className="border-[1px] border-red-500 px-4 py-2">
          Quiz not found
        </h1>
      </div>
    );
  }
  return (
    <AddTimeForQuiz
      initialStartTime={data.startTime}
      initailStartDate={data.startDate}
      initialEndTime={data.endTime}
      initialEndDate={data.endDate}
      initailDuration={data.duration}
    />
  );
}
