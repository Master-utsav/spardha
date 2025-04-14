import { CohereClientV2 } from 'cohere-ai';
import { convertToJSON } from './math';

const cohere = new CohereClientV2({});

interface Data {
  isCorrect: number;
  correctSolution: string;
}

export async function aiCheckSolutionResponse(
  problemStatement: string,
  buggySolution: string,
  programmingLanguage: string,
  userSolution: string
) {
  const stream = await cohere.chatStream({
    model: 'command-r-plus-08-2024',
    messages: [
      {
        role: 'system',
        content:
          'You are a highly skilled chatbot that responds in a natural, human-like manner. When answering queries, make sure to format your response cleanly, using bullet points for lists and code snippets for any code. The response should be concise and easy to understand.',
      },
      {
        role: 'user',
        content: `Here is the problem statement in ${programmingLanguage}: \"${problemStatement}\". This is the buggy solution: \n${programmingLanguage}\n${buggySolution}\n. Here is the user-provided solution: \n${programmingLanguage}\n${userSolution}\n. Please determine if the user solution is a corrected implementation of the buggy solution.`,
      },
      {
        role: 'user',
        content: `If the user solution is correct, return "isCorrect: 1". If the solution is incorrect, return "isCorrect: 0", thats it just return this only. Dont explain any code just return 0 and 1 for incorrect and correct solution repectively.`,
      },
    ],
  });

  let accumulatedContent = '';
  for await (const chatEvent of stream) {
    if (chatEvent.type === 'content-delta') {
      const messageContent = chatEvent.delta?.message?.content?.text;
      if (messageContent) {
        accumulatedContent += messageContent;
      }
    }
  }

  const answer = convertToJSON(accumulatedContent);
  return answer.isCorrect;
}
