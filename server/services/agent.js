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
exports.AgentService = void 0;
const tools_1 = require("@langchain/core/tools");
const google_genai_1 = require("@langchain/google-genai");
const zod_1 = require("zod");
const agents_1 = require("langchain/agents");
class AgentService {
    constructor(vectorStore) {
        this.vectoreStore = vectorStore;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTool = (0, tools_1.tool)((_a) => __awaiter(this, [_a], void 0, function* ({ query }) {
                const results = yield this.vectoreStore.similaritySearch(query);
                return results.map(r => r.content).join('\n');
            }), {
                name: 'search',
                description: 'Search for relevant information in the vector database',
                schema: zod_1.z.object({
                    query: zod_1.z.string().describe('The search query to use.'),
                }),
            });
            const model = new google_genai_1.ChatGoogleGenerativeAI({
                model: "gemini-pro",
                temperature: 0.7,
                maxRetries: 2,
            });
            this.executor = yield (0, agents_1.initializeAgentExecutorWithOptions)([searchTool], model, {
                agentType: 'chat-conversational-react-description',
                verbose: true,
            });
        });
    }
    execute(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.executor.call({ input });
            return {
                output: result.output,
                actions: result.intermediateSteps.map(step => ({
                    tool: step.action.tool,
                    input: step.action.toolInput,
                    thought: step.action.log,
                })),
            };
        });
    }
}
exports.AgentService = AgentService;
