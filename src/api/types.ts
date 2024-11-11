export interface Game {
  game_id: string;
  ticket_price: number;
  agents: {
    name: string;
    tokens: number;
    personality: string;
    choice: string | null;
    allies: string[];
  }[];
  current_round: number | null;
}

export interface AgentConfig {
  id: string;
  name: string;
  initial_tokens: number;
  personality: string;
}

export interface GameConfig {
  ticket_price: number;
  agents: AgentConfig[];
}

export interface GameResponse {
  message: string;
  game_id: string;
}

export interface AgentState {
  tokens: number;
  choice: string;
  allies: string[];
  messages: Message[];
  thoughts: ThoughtProcess[];
  deals: Deal[];
}

export interface Message {
  from_agent: string;
  to_agent: string;
  content: string;
  timestamp: string;
  round_number: number;
}

export interface ThoughtProcess {
  agent_name: string;
  content: string;
  timestamp: string;
  round_number: number;
}

export interface Deal {
  proposer: string;
  receiver: string;
  content: string;
  status: string;
  timestamp: string;
  round_number: number;
}

export interface GameState {
  current_round: number;
  game_status: string;
  agent_states: {
    [key: string]: {
      tokens: number;
      choice: string;
      alliances: string[];
    };
  };
  rounds_completed: number[];
  results: any;
  rewards: any;
}
