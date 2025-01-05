import dotenv from 'dotenv';
dotenv.config();

export const config = { 
    modelkey: process.env.modelKey,
    models: {
        embedding: 'sentence-transformers/all-MiniLM-L6-v2',
        llm: 'HuggingFaceH$/zephyr-7b-beta',
    },
    vectorStore: {
        path: process.env.VECTOR_STORE_PATH,
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY
    }
}