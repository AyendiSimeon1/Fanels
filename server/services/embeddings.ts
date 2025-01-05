import { HuggingFaceTransformersEmbeddings } from 'langchain';
import { config } from '../config/app';
import { PineconeClient } from 'pinecone-client'; // Assuming you have a Pinecone client

export class EmbeddingsService {
    private embeddings: HuggingFaceTransformersEmbeddings;
    private pineconeClient: PineconeClient<any>;

    constructor () {
        this.embeddings = new HuggingFaceTransformersEmbeddings({
            modelName: config.models.embedding,
        });
        if (!config.pinecone.apiKey) {
            throw new Error('Pinecone API key is not defined');
        }
        this.pineconeClient = new PineconeClient({ apiKey: config.pinecone.apiKey }); // Initialize Pinecone client
    }

    async embedQuery(text: string) : Promise<number[]> {
        return this.embeddings.embedQuery(text);
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        return this.embeddings.embedDocuments(documents); // Fixed recursive call
    }

    async queryPinecone(query: string, k: number) {
        const embedding = await this.embedQuery(query);
        const results = await this.pineconeClient.index(config.pinecone.indexName).query({
            queryVector: embedding,
            topK: k,
            includeMetadata: true,
        });
        return results;
    }
}
