import { config } from '../config/app';
import { Pinecone } from '@pinecone-database/pinecone';

type Metadata = { size: number, tags?: string[] | null, index: string | null };

export class EmbeddingsService {
    private pineconeClient: Pinecone;
    private model: string = 'multilingual-e5-large'; // From your documentation example

    constructor() {
        if (!config.pinecone.apiKey) {
            throw new Error('Pinecone API key is not defined');
        }
        this.pineconeClient = new Pinecone({
            apiKey: config.pinecone.apiKey
        });
    }

    async embedQuery(text: string): Promise<number[]> {
        const embedding = await this.pineconeClient.inference.embed(
            this.model,
            [text],
            { inputType: 'query' }
        );
        return embedding[0].values;
    }

    async embedDocuments(documents: string[]): Promise<number[][]> {
        const embeddings = await this.pineconeClient.inference.embed(
            this.model,
            documents,
            { inputType: 'passage', truncate: 'END' }
        );
        return embeddings.map(e => e.values);
    }

    async queryPinecone(query: string, k: number) {
        if (!config.pinecone.indexName) {
            throw new Error('Pinecone index name is not defined');
        }

        const queryEmbedding = await this.embedQuery(query);
        const index = this.pineconeClient.index(config.pinecone.indexName);

        const namespace = config.pinecone.namespace || 'example-namespace';
        const results = await index.namespace(namespace).query({
            topK: k,
            vector: queryEmbedding,
            includeValues: false,
            includeMetadata: true
        });

        return results;
    }

    async getEmbedding(content: string): Promise<number[]> {
        return this.embedQuery(content);
    }
}