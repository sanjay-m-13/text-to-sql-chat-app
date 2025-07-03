import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: groq('llama3-70b-8192'),
      messages,
      system: `You are a helpful SQL assistant. Help users convert natural language queries to SQL.

      When providing SQL queries:
      - Use proper PostgreSQL syntax
      - Include explanations of what the query does
      - Suggest best practices
      - Format SQL code clearly
      - Ask for clarification if the request is ambiguous

      Always be helpful and provide clear, well-formatted responses.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
