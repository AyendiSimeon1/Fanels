"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const vectoreStore_1 = require("../services/vectoreStore");
const llm_1 = require("../services/llm");
class ChatController {
    constructor() {
        this.vectoreStore = new vectoreStore_1.VectorStoreService();
        this.agentService = new llm_1.LLMService(this.vectoreStore);
        this.llmService = new llm_1.LLMService();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.vectoreStore.initialize();
            yield this.agentService.initialize();
        });
    }
    handleChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { prompt } = req.body;
                if (!prompt) {
                    return res.status(400).json({ error: ' Prompt is required' });
                }
                const searchResults = yield this.vectoreStore.similaritySearch(prompt);
                const context = searchResults.map(r => r.content);
                const agentResponse = yield this.agentService.execute(prompt);
                const finalResponse = yield this.llmService.generateResponse(prompt, [...context, agentResponse.output]);
                res.json({
                    response: finalResponse,
                    context: searchResults,
                    agentActions: agentResponse.actions,
                });
            }
            catch (error) {
                console.log('Eror handling chat:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.ChatController = ChatController;
