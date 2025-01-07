"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    modelkey: process.env.modelKey,
    models: {
        embedding: 'sentence-transformers/all-MiniLM-L6-v2',
        llm: 'HuggingFaceH$/zephyr-7b-beta',
    },
    vectorStore: {
        path: process.env.VECTOR_STORE_PATH,
    },
    pineConeKey: process.env.PINECONE_API_KEY,
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY,
        indexName: process.env.PINECONE_INDEX_NAME, // added indexName property
    },
};
