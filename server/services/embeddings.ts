import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import { config } from '../config/app';
import { Pinecone } from '@pinecone-database/pinecone';

type Metadata = { size: number, tags?: string[] | null, index: string | null };

export class EmbeddingsService {
    private embeddings: HuggingFaceInferenceEmbeddings;
    private pineconeClient: Pinecone;

    constructor () {
        this.embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: "YOUR-API-KEY", 
          });
        if (!config.pinecone.apiKey) {
            throw new Error('Pinecone API key is not defined');
        }
        this.pineconeClient = new Pinecone({
            apiKey: config.pinecone.apiKey,
        
        });
    }

    async embedQuery(text: string) : Promise<number[]> {
        return this.embeddings.embedQuery(text);
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        return this.embeddings.embedDocuments(documents); 
    }

    async queryPinecone(query: string, k: number) {
        const embedding = await this.embedQuery(query);
        if (!config.pinecone.indexName) {
            throw new Error('Pinecone index name is not defined');
        }
        const index = this.pineconeClient.Index(config.pinecone.indexName);
        const results = await index.query({
            vector: embedding,
            topK: k,
            includeMetadata: true,
        });
        return results;
    }
    async getEmbedding(content: string): Promise<number[]> {

        // Implement the logic to get embeddings for the content

        // This is a placeholder implementation

        return new Promise((resolve) => {

            resolve([0.1, 0.2, 0.3]); // Replace with actual embedding logic

        });
    }
}
