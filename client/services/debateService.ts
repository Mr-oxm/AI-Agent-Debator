import { Debate, DebateRound } from "@/types/debate";

interface StartDebateResponse {
  debate_id: string;
  total_rounds: number;
}

interface RoundResponse {
  round: number;
  total_rounds: number;
  con: string;
  pro: string;
  judge: string;
  verdict: string | null;
}

// Store the current debate ID and total rounds
let currentDebateId: string | null = null;
let totalRounds: number = 0;

export const startDebate = async (proposition: string): Promise<StartDebateResponse> => {
  try {
    const response = await fetch("http://localhost:8000/api/debate/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ proposition }),
    });

    if (!response.ok) {
      throw new Error("Failed to start debate");
    }

    const data: StartDebateResponse = await response.json();
    currentDebateId = data.debate_id;
    totalRounds = data.total_rounds;
    
    return data;
  } catch (error) {
    console.error("Error starting debate:", error);
    throw error;
  }
};

export const getDebateRound = async (roundNum: number): Promise<RoundResponse> => {
  if (!currentDebateId) {
    throw new Error("No active debate");
  }

  try {
    const response = await fetch(`http://localhost:8000/api/debate/${currentDebateId}/round/${roundNum}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get debate round");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting debate round:", error);
    throw error;
  }
};

export const getTotalRounds = (): number => {
  return totalRounds;
};

export const resetDebateState = (): void => {
  currentDebateId = null;
  totalRounds = 0;
};