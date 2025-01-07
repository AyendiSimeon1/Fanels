import { tool } from '@langchain/core/tools';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { AgentExecutor, initializeAgentExecutorWithOptions } from 'langchain/agents';
import { VectorStoreService } from './vectoreStore';
import { config } from '../config/app';

export class AgentService {
    private executor: AgentExecutor;
    private vectoreStore: VectorStoreService;

    constructor(vectorStore: VectorStoreService) {
        this.vectoreStore = vectorStore;
    }

    async initialize() {
        const searchTool = tool(
            async ({ query }: { query: string }) => {
                const results = await this.vectoreStore.similaritySearch(query);
                return results.map(r => r.content).join('\n');
            },
            {
                name: 'search',
                description: 'Search for relevant information in the vector database',
                schema: z.object({
                    query: z.string().describe('The search query to use.'),
                }),
            }
        );

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-pro",
            temperature: 0.7,
            maxRetries: 2,
        });

        this.executor = await initializeAgentExecutorWithOptions(
            [searchTool],
            model,
            {
                agentType: 'chat-conversational-react-description',
                verbose: true,
            }
        );
    }

    async execute(input: string): Promise<any> {
        const result = await this.executor.call({ input });
        
        return {
            output: result.output,
            actions: result.intermediateSteps.map(step => ({
                tool: step.action.tool,
                input: step.action.toolInput,
                thought: step.action.log,
            })),
        };
    }
}