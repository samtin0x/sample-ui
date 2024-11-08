// page.tsx
"use client";

import GameInterface from "@/components/main/GameInterface";
import GameSetup from "@/components/main/GameSetup";
import { useState } from "react";
import { Agent } from "@/components/types";
import { GameControls } from "@/components/GameControls";

const SIMULATION_STEPS = ["Getting to know each other", "Negotiating", "End"] as const;
type Step = typeof SIMULATION_STEPS[number];

export default function GamePage() {
  const [gameState, setGameState] = useState<{
    started: boolean;
    agents: Agent[];
    simulationStarted: boolean;
    currentStep: Step;
  }>({
    started: false,
    agents: [],
    simulationStarted: false,
    currentStep: "Getting to know each other"
  });

  const handleGameStart = (agents: Agent[]) => {
    setGameState({
      started: true,
      agents,
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

      // If we're at the end, reset to start new simulation
      if (currentIndex === SIMULATION_STEPS.length - 1) {
        return {
          ...prev,
          simulationStarted: false,
          currentStep: "Getting to know each other"
        };
      }

      // Otherwise, move to next step
      return {
        ...prev,
        currentStep: SIMULATION_STEPS[currentIndex + 1]
      };
    });
  };

  return (
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Game Mechanism Dashboard</h1>

          {!gameState.started ? (
              <GameSetup onGameStart={handleGameStart} />
          ) : (
              <div className="space-y-6">
                <GameControls
                    isSimulationStarted={gameState.simulationStarted}
                    onStartSimulation={handleSimulationStart}
                    onNextRound={handleNextStep}
                    currentStep={gameState.currentStep}
                />
                <GameInterface
                    agents={gameState.agents}
                />
              </div>
          )}
        </div>
      </main>
  );
}