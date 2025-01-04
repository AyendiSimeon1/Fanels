import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from 'langchain/prompts';

import { LLMChain } from 'langchain/chains';
impot { config } from '../config';


export class LLMService {
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({
            modelKey: config.modelKey,
            modelName: 'gpt-4-turbo-preview',
            temperature: 0.7
        });
    }

    async generateResponse(
        prompt: string,
        context: string[]
    ): Promise<string> {
        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                'You are a helpful AI assistant. Use the following context'
            ),
            HumanMessagePromptTemplate.fromTemplate('{question}')
        ]);

        const chain = new LLMChain({
            prompt: chatPrompt,
            llm: this.model,
        });

        const result = await chain.call({
            context: context.join('\n'),
            question: prompt,
        });

        return result.text;
    }
}