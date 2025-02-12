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
    pineConeKey: process.env.PINECONE_API_KEY,
    pinecone: {

        apiKey: process.env.PINECONE_API_KEY,
        indexName: process.env.PINECONE_INDEX_NAME, // added indexName property
        namespace: 'optional-namespace',
        dimension: 1536, // Adjust based on your embedding model
        cloud: 'aws',
        region: 'us-west-2'
    },
  
}