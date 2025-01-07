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
exports.EmbeddingsService = void 0;
const hf_1 = require("@langchain/community/embeddings/hf");
const app_1 = require("../config/app");
const pinecone_1 = require("@pinecone-database/pinecone");
class EmbeddingsService {
    constructor() {
        this.embeddings = new hf_1.HuggingFaceInferenceEmbeddings({
            apiKey: "YOUR-API-KEY",
        });
        if (!app_1.config.pinecone.apiKey) {
            throw new Error('Pinecone API key is not defined');
        }
        this.pineconeClient = new pinecone_1.Pinecone({
            apiKey: app_1.config.pinecone.apiKey,
        });
    }
    embedQuery(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.embeddings.embedQuery(text);
        });
    }
    embedDocuments(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.embeddings.embedDocuments(documents);
        });
    }
    queryPinecone(query, k) {
        return __awaiter(this, void 0, void 0, function* () {
            const embedding = yield this.embedQuery(query);
            if (!app_1.config.pinecone.indexName) {
                throw new Error('Pinecone index name is not defined');
            }
            const index = this.pineconeClient.Index(app_1.config.pinecone.indexName);
            const results = yield index.query({
                vector: embedding,
                topK: k,
                includeMetadata: true,
            });
            return results;
        });
    }
}
exports.EmbeddingsService = EmbeddingsService;
