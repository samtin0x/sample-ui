import {AgentState, Deal, GameConfig, GameResponse, GameState, Message, ThoughtProcess} from "@/api/types";

export class GameApiHandler {
    private baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:8001') {
        this.baseUrl = baseUrl;
    }

    private async fetchApi<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'API request failed');
        }

        return response.json();
    }

    // Game Creation and Control
    async createGame(config: GameConfig): Promise<GameResponse> {
        return this.fetchApi<GameResponse>('/game/create', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }

    async startGame(): Promise<GameResponse> {
        return this.fetchApi<GameResponse>('/game/start', {
            method: 'POST',
        });
    }

    // Game State Retrieval
    async getCurrentGameState(): Promise<GameState> {
        return this.fetchApi<GameState>('/game/state');
    }

    async getRoundData(roundNumber: number): Promise<any> {
        return this.fetchApi<any>(`/game/round/${roundNumber}`);
    }

    async getAgentInteractions(agentA: string, agentB: string): Promise<{
        messages: Message[];
        deals: Deal[];
        alliances: any[];
    }> {
        return this.fetchApi<any>(`/game/agent-interactions/${agentA}/${agentB}`);
    }

    async getAgentState(agentName: string): Promise<AgentState> {
        return this.fetchApi<AgentState>(`/game/agent/${agentName}`);
    }

    async getAllAgents(): Promise<{
        [key: string]: {
            tokens: number;
            allies: string[];
            choice: string;
        };
    }> {
        return this.fetchApi<any>('/game/agents');
    }

    async getAllMessages(): Promise<Message[]> {
        return this.fetchApi<Message[]>('/game/messages');
    }

    async getAllThoughtProcesses(): Promise<ThoughtProcess[]> {
        return this.fetchApi<ThoughtProcess[]>('/game/thought-processes');
    }

    // Historical Game Data
    async getHistoricalGameState(gameId: string): Promise<GameState> {
        return this.fetchApi<GameState>(`/history/${gameId}/state`);
    }
}
