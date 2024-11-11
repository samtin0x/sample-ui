import {
  AgentState,
  Deal,
  Game,
  GameConfig,
  GameResponse,
  GameState,
  Message,
  ThoughtProcess,
} from "@/api/types";

export class GameApiHandler {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL) {
    if (!baseUrl) {
      console.error("No API URL provided");
      throw new Error("API URL is required");
    }
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || "API request failed");
    }

    return response.json();
  }

  async createGame(config: GameConfig): Promise<GameResponse> {
    return this.fetchApi<GameResponse>("/game/create", {
      method: "POST",
      body: JSON.stringify(config),
    });
  }

  async listGames(): Promise<Game[]> {
    return this.fetchApi<Game[]>("/games");
  }

  async resetGame(gameId: string): Promise<GameResponse> {
    return this.fetchApi<GameResponse>(`/game/${gameId}/reset`, {
      method: "POST",
    });
  }

  async progressRound(gameId: string): Promise<GameResponse> {
    return this.fetchApi<GameResponse>(`/game/${gameId}/progress`, {
      method: "POST",
    });
  }

  async getCurrentGameState(gameId: string): Promise<GameState> {
    return this.fetchApi<GameState>(`/game/${gameId}/state`);
  }

  async getAgentInteractions(
    gameId: string,
    agentA: string,
    agentB: string,
  ): Promise<{
    messages: Message[];
    deals: Deal[];
    alliances: any[];
  }> {
    return this.fetchApi<any>(
      `/game/${gameId}/agent-interactions/${agentA}/${agentB}`,
    );
  }

  async getAllAgents(gameId: string): Promise<Record<string, AgentState>> {
    if (!gameId) {
      throw new Error("Game ID is required");
    }
    return this.fetchApi<Record<string, AgentState>>(`/game/${gameId}/agents`);
  }

  async getAllThoughtProcesses(gameId: string): Promise<ThoughtProcess[]> {
    return this.fetchApi<ThoughtProcess[]>(`/game/${gameId}/thought-processes`);
  }
}
