export interface SearchResult {
    content: string;
    metadata: Record<string, any>;
    score: number;
}

export interface AgentAction {
    tool: string;
    input: string;
    thought?: string;
}

export interface AgentResponse {
    output: string;
    actions: AgentAction[];
}