import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../config/app';
import { SearchResult } from '../types';

export class VectorStoreService {
    private pinecone: Pinecone;
    private index: any;
    private readonly indexName: string;
    private readonly namespace: string;
    private readonly model = 'multilingual-e5-large';

    constructor() {
        this.initialize().catch(error => {
            console.error('Initialization failed:', error);
        });
        this.indexName = config.pinecone.indexName || 'default-index-name';
        this.namespace = config.pinecone.namespace || 'example-namespace';
        this.pinecone = new Pinecone({
            apiKey: config.pinecone.apiKey || 'sdfa'
        });
    }

    async initialize() {
        try {
            // Get the index
            this.index = this.pinecone.index(this.indexName);
            
            // Optional: Create index if it doesn't exist
            const indexList = await this.pinecone.listIndexes();
            if (!indexList) {
                await this.pinecone.createIndex({
                    name: this.indexName,
                    dimension: 1024, // dimension for multilingual-e5-large
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: 'us-west-2'
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
            // Get embeddings for all documents
            const embeddings = await this.pinecone.inference.embed(
                this.model,
                documents.map(d => d.content),
                { inputType: 'passage', truncate: 'END' }
            );

            // Prepare records for upsert
            const records = documents.map((doc, i) => ({
                id: doc.metadata.id || `doc-${i}`,
                values: embeddings[i].values,
                metadata: {
                    ...doc.metadata,
                    text: doc.content
                }
            }));

            // Upsert in batches of 100
            const batchSize = 100;
            for (let i = 0; i < records.length; i += batchSize) {
                const batch = records.slice(i, i + batchSize);
                await this.index.namespace(this.namespace).upsert(batch);
            }

            console.log(`Successfully added ${records.length} documents to Pinecone`);
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
            // Convert query to embedding using Pinecone's inference API
            const queryEmbedding = await this.pinecone.inference.embed(
                this.model,
                [query],
                { inputType: 'query' }
            );

            // Search the index
            const queryResponse = await this.index.namespace(this.namespace).query({
                topK: k,
                vector: queryEmbedding[0].values,
                includeValues: false,
                includeMetadata: true
            });

            return queryResponse.matches.map((match: any) => ({
                content: match.metadata.text,
                metadata: { ...match.metadata, text: undefined },
                score: match.score
            }));
        } catch (error) {
            console.error('Error performing similarity search:', error);
            throw new Error('Failed to perform similarity search');
        }
    }
}