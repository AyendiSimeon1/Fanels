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
exports.LLMService = void 0;
const prompts_1 = require("@langchain/core/prompts");
const google_vertexai_1 = require("@langchain/google-vertexai");
class LLMService {
    constructor() {
        this.model = new google_vertexai_1.ChatVertexAI({
            model: "gemini-2.0-flash-exp",
            temperature: 0.7,
            maxRetries: 2,
        });
    }
    generateResponse(prompt, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatPrompt = prompts_1.ChatPromptTemplate.fromMessages([
                prompts_1.SystemMessagePromptTemplate.fromTemplate('You are a helpful AI assistant. Use the following context'),
                prompts_1.HumanMessagePromptTemplate.fromTemplate('{question}')
            ]);
            const chain = chatPrompt.pipe(this.model);
            const result = yield chain.invoke({ question: prompt });
            if (typeof result.content === 'string') {
                return result.content;
            }
            const content = result.content[0];
            if ('text' in content) {
                return content.text;
            }
            throw new Error('Unexpected message content type');
        });
    }
}
exports.LLMService = LLMService;
