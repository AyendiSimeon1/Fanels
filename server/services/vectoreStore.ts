import { PineconeClient } from '@pinecone-database/pinecone';
import { EmbeddingsService } from './embeddings';
import { config } from '../config/app';
import { SearchResult } from '../types';

export class VectorStoreService {
    private pineconeClient: PineconeClient | null = null;
    private embeddings: EmbeddingsService;

    constructor() {
        this.embeddings = new EmbeddingsService();
    }

    async initialize() {
        try {
            this.pineconeClient = new PineconeClient();
            await this.pineconeClient.init({
                apiKey: config.pinecone.apiKey, // Your Pinecone API key
            });

            // Assuming your index is already created, or you can create a new one
            this.pineconeClient.index(config.pinecone.indexName);
        } catch (error) {
            console.error('Error initializing Pinecone client:', error);
            throw new Error('Failed to initialize Pinecone client');
        }
    }

    async addDocument(documents: { content: string, metadata: object }[]) {
        if (!this.pineconeClient) {
            throw new Error('Pinecone client not initialized');
        }

        try {
            const vectors = await Promise.all(
                documents.map(async (doc) => {
                    const embedding = await this.embeddings.getEmbedding(doc.content);
                    return {
                        id: doc.metadata.id,
                        values: embedding,
                        metadata: doc.metadata
                    };
                })
            );

            await this.pineconeClient.index(config.pinecone.indexName).upsert({
                vectors,
            });
            console.log('Documents added successfully');
        } catch (error) {
            console.error('Error adding documents to Pinecone:', error);
            throw new Error('Failed to add documents');
        }
    }

    async similaritySearch(query: string, k = 4): Promise<SearchResult[]> {
        if (!this.pineconeClient) {
            throw new Error('Pinecone client not initialized');
        }

        try {
            const embedding = await this.embeddings.getEmbedding(query);
            const results = await this.pineconeClient.index(config.pinecone.indexName).query({
                queryVector: embedding,
                topK: k,
                includeMetadata: true,
            });

            return results.matches.map((match) => ({
                content: match.metadata.content,
                metadata: match.metadata,
                score: match.score,
            }));
        } catch (error) {
            console.error('Error performing similarity search:', error);
            throw new Error('Failed to perform similarity search');
        }
    }
}
