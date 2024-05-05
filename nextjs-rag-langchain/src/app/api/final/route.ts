import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables'
import { OpenAIEmbeddings } from '@langchain/openai'; 
import { Pinecone } from '@pinecone-database/pinecone';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = `Answer the user's questions if and only if the user asks about terms related to cars. You have chat_history
holding any information on previous similar cars If you answer, your answer must use the context or chat history given
If the answer is not in the context, reply politely that you do not have that information available. 
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:`;

// Pinecone Client
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});
// Retrieve Pineccone Index
const index = pc.Index("carindex")

// Historical context (Context seen so far)
const historicalContextSet = new Set();

export async function POST(req: Request) {
    try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();
        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
        const currentMessageContent = messages[messages.length - 1].content;

        // Embed the request/query
        const queryEmbedding = await new OpenAIEmbeddings().embedQuery(currentMessageContent)

        let queryResponse = await index.query({
                topK: 3,
                vector: queryEmbedding,
                includeMetadata: true,
                includeValues: true,
        });

        // Format the retrieved documents to be used as context
        const newDocsContext = queryResponse.matches.map(match => match.metadata?.text).join("\n");

        let cleanedString = "";
        for (let char of newDocsContext) {
            // Check if the character is alphanumeric or a space
            if (char.match(/[a-zA-Z0-9: ]/)) {
                cleanedString += char;
            }
        }

        // Add new unique context to historical context
        historicalContextSet.add(cleanedString);
         
        // Convert array into string
        const allContexts = Array.from(historicalContextSet).join("\n\n");

        const prompt = PromptTemplate.fromTemplate(TEMPLATE);

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            model: 'gpt-4',
            temperature: 0.0,
            streaming: true,
            verbose: true,
        });

        // Parser to parse GPT output into string
        const parser = new HttpResponseOutputParser();

        const chain = RunnableSequence.from([
            {
                question: (input) => input.question,
                chat_history: (input) => input.chat_history,
                context: () => allContexts,
            },
            prompt,
            model,
            parser,
        ]);

        // Convert the response into a friendly text-stream
        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join('\n'),
            question: currentMessageContent,
        });

        // Respond with the stream
        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
