import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "@langchain/core/prompts";
import { ChatVertexAI } from "@langchain/google-vertexai";

export class LLMService {
    private model: ChatVertexAI;

    constructor() {
        this.model = new ChatVertexAI({
            model: "gemini-2.0-flash-exp",
            temperature: 0.7,
            maxRetries: 2,
        });
    }

    async generateResponse(prompt: string, context: string[]): Promise<string> {
        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                'You are a helpful AI assistant. Use the following context'
            ),
            HumanMessagePromptTemplate.fromTemplate('{question}')
        ]);

        const chain = chatPrompt.pipe(this.model);
        const result = await chain.invoke({ question: prompt });
        if (typeof result.content === 'string') {
            return result.content;
        }
        const content = result.content[0];
        if ('text' in content) {
            return content.text;
        }
        throw new Error('Unexpected message content type');
    }
}
