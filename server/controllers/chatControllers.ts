import { Request, Response } from 'express';
import { AgentService } from '../services/agent';
import { VectorStoreService } from '../services/vectoreStore';
import { LLMService } from '../services/llm';

export class ChatController {
    private agentService: AgentService;
    private vectoreStore: VectorStoreService;
    private llmService: LLMService;

    constructor() {
        this.vectoreStore = new VectorStoreService();
        this.agentService = new LLMService(this.vectoreStore);
        this.llmService = new LLMService();
    }

    async initialize() {
        await this.vectoreStore.initialize();
        await this.agentService.initialize();
    }

    async handleChat(req:Request, res:Response) {
        try {
            const { prompt } = req.body;

            if (!prompt) {
                return res.status(400).json({ error: ' Prompt is required' });


            }
            const searchResults = await this.vectoreStore.similaritySearch(prompt);
            const context = searchResults.map(r => r.content);

            const agentResponse = await this.agentService.execute(prompt);

            const finalResponse = await this.llmService.generateResponse(
                prompt,
                [...context, agentResponse.output]
            );

            res.json({
                response: finalResponse,
                context: searchResults,
                agentActions: agentResponse.actions,

            });
            
    }catch (error) {
        console.log('Eror handling chat:', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}
}