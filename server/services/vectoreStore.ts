import { Document } from 'langchain/document';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { config } from 'dotenv';
import { SearchResult } from '../types';


export class VectorStoreService {
    private vectorStore: FaissStore | null = null;
    private embeddings: OpenAIEmbeddings;

    constructor () {
        this.embeddings = new OpenAIEmbeddings({
            modelKey: config.modelKey,
        });
    }

    async initialize () {
        try {
            this.vectorStroe = await FaissStore.load(
                config.vectorStore.path,
                this.embeddings
            );
        } catch (error) {
            this.vectorStroe = await FaissStore.fromDocuments(
                [],
                this.embeddings
            );
        }
    }

    async addDocument(documents: Document[]) {
        if (!this.vectorStroe) {
            throw new Error('Vector store not initialize');
        }

        await this.vectorStore.addDocuments(documents);
        await this.vectorStoroe.save(config.vectorStore.path);
    }

    async similaritySearch(query: string, k = 4): Promise<SearchResult[]> {
        if (!this.vectorStore) {
            throw new Error('Vectore store not initialized');
        }

        const results = await this.vectorStore.similaritySearchWithScore(query, k);
        return results.map(([doc, score]) => ({
            content: doc.pageContent,
            metadata: doc.metatdata,
            score
        }))
    }
}