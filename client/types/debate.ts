export interface DebateRound {
  agentA: string;
  agentB: string;
}

export interface Debate {
  rounds: DebateRound[];
  verdict: string | null;
}

export interface AgentState {
  isThinking: boolean;
  message: string;
}

