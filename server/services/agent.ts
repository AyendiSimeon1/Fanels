import { Tool } from 'langchain/tools';
import { AgentExecutor, initializeAgentExecutorWithOptions } from 'lanchain/agenst';
import { ChatOpenAI } from '@langchain/chat_models/openai';
import { VectorStoreService } from './vectoreStore';
import { config } from '../config/app';

export class AgentService {
    private executor: AgentExecutor,
    private vectoreStore: VectorStoreService;

    constructor(vectorStore: VectorStoreService) {
        this.vectoreStore = vectorStore;
    }

    async initialize() {
        const tools = [
            name: 'search',
            description: 'Search for relevant information the vector database',
            func: async (query:string) => {
                const results = await this.vectoreStore.similaritySearch(query);
                return results.map(r => r.content).join('\n');
            }
        ];

        const model = new ChatOpenAI({
            openAIApiKey: config.openAiKey,
            modelName: 'gpt-4-turbo-preview',
            temperature: 0.7,
          });
      
          this.executor = await initializeAgentExecutorWithOptions(
            tools,
            model,
            {
              agentType: 'chat-conversational-react-description',
              verbose: true,
            }
            
          );
        
    }

    async execute(input: string): Promise<AgentResponse> {
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