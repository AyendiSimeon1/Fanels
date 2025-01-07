import { Pinecone } from '@pinecone-database/pinecone';
import { EmbeddingsService } from './embeddings';
import { config } from '../config/app';
import { SearchResult } from '../types';

export class VectorStoreService {
    private pinecone!: Pinecone;
    private index: any; // Replace 'any' with proper Pinecone index type when available
    private embeddings: EmbeddingsService;
    private readonly indexName: string;
    private readonly namespace: string;

    constructor() {
        this.initialize().catch(error => {
            console.error('Initialization failed:', error);
        });
        this.embeddings = new EmbeddingsService();
        this.indexName = config.pinecone.indexName!;
        this.namespace = config.pinecone.namespace ?? '';
    }

    async initialize() {
        try {
            // Initialize Pinecone client
            this.pinecone = new Pinecone({
                apiKey: config.pinecone.apiKey!,
            });

            // Wait for index to be ready
            this.index = this.pinecone.index(this.indexName);
            
            // Optional: Create index if it doesn't exist
            const indexList = await this.pinecone.listIndexes();
            if (!indexList) {
                await this.pinecone.createIndex({
                    name: this.indexName,
                    dimension: config.pinecone.dimension!, // Add this to your config (e.g., 1536 for OpenAI embeddings)
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud:  'aws',
                            region: config.pinecone.region ?? 'us-west-2'
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing Pinecone client:', error);
            throw new Error('Failed to initialize Pinecone client');
        }
    }

    async addDocuments(documents: { content: string; metadata: Record<string, any> }[]) {
        if (!this.index) {
            throw new Error('Pinecone index not initialized');
        }

        try {
            const vectors = await Promise.all(
                documents.map(async (doc, index) => {
                    const embedding = await this.embeddings.getEmbedding(doc.content!);
                    return {
                        id: doc.metadata.id || `doc-${index}`,
                        values: embedding,
                        metadata: {
                            ...doc.metadata,
                            content: doc.content // Store content in metadata for retrieval
                        }
                    };
                })
            );

            // Batch upserts in chunks of 100 to avoid rate limits
            const batchSize = 100;
            for (let i = 0; i < vectors.length; i += batchSize) {
                const batch = vectors.slice(i, i + batchSize);
                await this.index.upsert(
                    this.namespace ? {
                        namespace: this.namespace,
                        vectors: batch
                    } : {
                        vectors: batch
                    }
                );
            }

            console.log(`Successfully added ${vectors.length} documents to Pinecone`);
        } catch (error) {
            console.error('Error adding documents to Pinecone:', error);
            throw new Error('Failed to add documents');
        }
    }

    async similaritySearch(query: string, k = 4): Promise<SearchResult[]> {
        if (!this.index) {
            throw new Error('Pinecone index not initialized');
        }

        try {
            const queryEmbedding = await this.embeddings.getEmbedding(query!);
            
            const queryResponse = await this.index.query({
                namespace: this.namespace,
                vector: queryEmbedding,
                topK: k,
                includeValues: false,
                includeMetadata: true
            });

            return queryResponse.matches.map((match: any) => ({
                content: match.metadata.content,
                metadata: { ...match.metadata, content: undefined }, // Remove content from metadata
                score: match.score
            }));
        } catch (error) {
            console.error('Error performing similarity search:', error);
            throw new Error('Failed to perform similarity search');
        }
    }
}