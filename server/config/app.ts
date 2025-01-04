import dotenv from 'dotenv';
dotenv.config();

export const config = { 
    modelkey: process.env.modelKey,
    vectorStore: {
        path: process.env.VECTOR_STORE_PATH,
    }
}