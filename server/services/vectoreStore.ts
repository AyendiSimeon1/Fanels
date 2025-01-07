import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';
import { config } from '../config/app';

export class VectorStoreService {
    private pinecone: Pinecone;
    private index: any;
    private namespace: string;
    private model: string;

    constructor() {
        this.pinecone = new Pinecone({
            apiKey: 'pcsk_ubWxM_GxMQPVemhB6wqJBxzo4myQz4WSjC9CvxiN6JkowokuuxrULAxC1HN2LQk7Fcimx'
        });
        this.model = 'multilingual-e5-large';
        this.namespace = 'default-namespace';
    }

    async initialize() {
        try {
            // Initialize the index
            this.index = this.pinecone.index('base');
            
            // Check if index exists, if not create it
            const indexList = await this.pinecone.listIndexes();
            if (!indexList) {
                await this.pinecone.createIndex({
                    name: 'base',
                    dimension: 1024,
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: 'asia'
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Failed to initialize vector store:', error);
            throw error;
        }
    }

    async addDocuments(documents: { id: string; content: string }[]): Promise<void> {
        try {
            // Generate embeddings for all documents
            const embeddings = await this.pinecone.inference.embed(
                this.model,
                documents.map(doc => doc.content),
                { inputType: 'passage', truncate: 'END' }
            );

            // Prepare records for upsert
            const records = documents.map((doc, i) => ({
                id: doc.id,
                values: embeddings[i].values,
                metadata: { content: doc.content }
            }));

            // Upsert in batches of 100 to avoid rate limits
            const batchSize = 100;
            for (let i = 0; i < records.length; i += batchSize) {
                const batch = records.slice(i, i + batchSize);
                await this.index.namespace(this.namespace).upsert(batch);
            }
        } catch (error) {
            console.error('Failed to add documents:', error);
            throw error;
        }
    }

    async similaritySearch(query: string, k: number = 3): Promise<Document[]> {
        try {
            // Generate embedding for the query
            const queryEmbedding = await this.pinecone.inference.embed(
                this.model,
                [query],
                { inputType: 'query' }
            );

            // Search the index
            const results = await this.index.namespace(this.namespace).query({
                topK: k,
                vector: queryEmbedding[0].values,
                includeValues: false,
                includeMetadata: true
            });

            // Convert to Document format expected by LangChain
            return results.matches.map((match: { metadata: { content: any; }; score: any; id: any; }) => new Document({
                pageContent: match.metadata.content,
                metadata: {
                    score: match.score,
                    id: match.id
                }
            }));
        } catch (error) {
            console.error('Failed to perform similarity search:', error);
            throw error;
        }
    }

    async deleteDocument(id: string): Promise<void> {
        try {
            await this.index.namespace(this.namespace).deleteOne(id);
        } catch (error) {
            console.error('Failed to delete document:', error);
            throw error;
        }
    }

    async deleteAll(): Promise<void> {
        try {
            await this.index.namespace(this.namespace).deleteAll();
        } catch (error) {
            console.error('Failed to delete all documents:', error);
            throw error;
        }
    }
}