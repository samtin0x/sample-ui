"use client";


import GameInterface from "@/components/main/GameInterface";
import GameSetup from "@/components/main/GameSetup";
import { useState, useEffect } from "react";
import { GameController } from "@/components/GameController";
import {AgentState, GameState} from "@/api/types";
import {GameApiHandler} from "@/api/handler";

export type Step = "Getting to know each other" | "Negotiating" | "End";
const SIMULATION_STEPS: Step[] = ["Getting to know each other", "Negotiating", "End"];

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    started: false,
    gameId: null,
    simulationStarted: false,
    currentStep: "Getting to know each other"
  });

  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({});
  const apiHandler = new GameApiHandler();

  // Fetch agent states periodically when game has started
  useEffect(() => {
    if (!gameState.started || !gameState.gameId) return;

    const fetchAgentStates = async () => {
      try {
        const states = await apiHandler.getAllAgents();
        setAgentStates(states);
      } catch (error) {
        console.error('Failed to fetch agent states:', error);
      }
    };

    // Initial fetch
    fetchAgentStates();

    // Set up polling
    const interval = setInterval(fetchAgentStates, 3000);

    return () => clearInterval(interval);
  }, [gameState.started, gameState.gameId]);

  const handleGameStart = async (gameId: string) => {
    setGameState({
      started: true,
      gameId,
      simulationStarted: false,
      currentStep: "Getting to know each other"
    });
  };

  const handleSimulationStart = () => {
    setGameState(prev => ({
      ...prev,
      simulationStarted: true
    }));
  };

  const handleNextStep = () => {
    setGameState(prev => {
      const currentIndex = SIMULATION_STEPS.indexOf(prev.currentStep);

      if (currentIndex === SIMULATION_STEPS.length - 1) {
        return {
          ...prev,
          simulationStarted: false,
          currentStep: "Getting to know each other"
        };
      }

      return {
        ...prev,
        currentStep: SIMULATION_STEPS[currentIndex + 1]
      };
    });
  };

  const agentsArray = Object.entries(agentStates).map(([id, state]) => ({
    id,
    name: id,
    balance: state.tokens,
    allies: state.alliances,
    choice: state.choice
  }));

  return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Game Mechanism Dashboard
          </h1>

          {!gameState.started ? (
              <GameSetup onGameStart={handleGameStart} />
          ) : (
              <div className="space-y-6">
                <GameController
                    isSimulationStarted={gameState.simulationStarted}
                    onStartSimulation={handleSimulationStart}
                    onNextRound={handleNextStep}
                    currentStep={gameState.currentStep}
                />
                <GameInterface
                    agents={agentsArray}
                />
              </div>
          )}
        </div>
      </main>
  );
}
