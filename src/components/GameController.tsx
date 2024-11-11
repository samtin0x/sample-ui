import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Check,
  Clock,
  AlertCircle,
  Trophy,
  Coins,
  Users,
  MessageCircle,
  Loader2,
  RefreshCw,
  Hash,
} from "lucide-react";
import { GameApiHandler } from "@/api/handler";
import { GameState } from "@/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getShapeIcon } from "@/components/AgentBalances";

export const SIMULATION_STEPS = [
  {
    id: 0,
    name: "Entry & Setup",
    description: "Agents purchase tickets and enter the game",
    buttonText: "Start Entry & Setup",
  },
  {
    id: 1,
    name: "Introductions",
    description: "Agents meet and share preferences",
    buttonText: "Begin Introductions",
  },
  {
    id: 2,
    name: "Alliance Formation",
    description: "Agents form alliances and make deals",
    buttonText: "Start Alliance Formation",
  },
  {
    id: 3,
    name: "Final Decision",
    description: "Agents make their shape choices",
    buttonText: "Make Final Decisions",
  },
] as const;

interface GameControllerProps {
  gameId: string;
  onGameStateUpdate?: (gameState: GameState) => void;
}

export const GameController = ({
  gameId,
  onGameStateUpdate,
}: GameControllerProps) => {
  const [gameState, setGameState] = useState<GameState>({
    current_round: -1,
    era: 1,
    game_status: "not_started",
    is_processing: false,
    agent_states: {},
    rounds_completed: [],
    results: null,
    rewards: null,
  });
  const [error, setError] = useState<string | null>(null);

  const gameHandler = new GameApiHandler();

  const fetchGameState = async () => {
    try {
      setError(null);
      const state = await gameHandler.getCurrentGameState(gameId);
      setGameState(state);
      onGameStateUpdate?.(state);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch game state";
      setError(errorMessage);
    }
  };

  // Poll game state every 3 seconds when processing
  useEffect(() => {
    if (!gameId || !gameState.is_processing) return;

    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
  }, [gameId, gameState.is_processing]);

  // Initial game state fetch
  useEffect(() => {
    if (!gameId) return;
    fetchGameState();
  }, [gameId]);

  // Handle next round progression
  const handleNextRound = async () => {
    setError(null);
    try {
      await gameHandler.progressRound(gameId);
      await fetchGameState();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to progress round";
      setError(errorMessage);
    }
  };

  const handleReset = async () => {
    setError(null);
    try {
      await gameHandler.resetGame(gameId);
      await fetchGameState();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reset game";
      setError(errorMessage);
    }
  };

  const currentRound = gameState.current_round;
  const isGameStarted = gameState.game_status !== "not_started";
  const isGameComplete = gameState.results !== null;
  const isProcessing = gameState.is_processing;

  const handleNarrator = () => {
    console.log("Narrator button clicked");
  };

  const getStepIcon = (stepId: number) => {
    if (!isGameStarted) return <Clock className="w-5 h-5 text-gray-400" />;
    if (currentRound > stepId)
      return <Check className="w-5 h-5 text-green-500" />;
    if (currentRound === stepId) {
      if (isProcessing)
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      return <Play className="w-5 h-5 text-blue-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStepStyle = (stepId: number) => {
    if (!isGameStarted) return "border-gray-200 bg-gray-50";
    if (currentRound > stepId)
      return "border-green-500 bg-green-50 text-green-700";
    if (currentRound === stepId)
      return "border-blue-500 bg-blue-50 text-blue-700";
    return "border-gray-200 bg-gray-50 text-gray-500";
  };

  const getButtonText = () => {
    if (isProcessing) {
      return "Processing...";
    }
    // If game hasn't started, show first step button text
    if (!isGameStarted) {
      return SIMULATION_STEPS[0].buttonText;
    }
    // Show current step's button text if we haven't completed the game
    if (!isGameComplete) {
      return SIMULATION_STEPS[currentRound].buttonText;
    }
    return null;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Game Progress</span>
          </CardTitle>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <Hash className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">
              Era {gameState.era}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Progress indicator */}
        <div className="relative pt-4">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
            <div
              style={{
                width: `${((currentRound + 1) / SIMULATION_STEPS.length) * 100}%`,
              }}
              className={`
                                transition-all duration-500 ease-in-out shadow-none 
                                flex flex-col text-center whitespace-nowrap text-white justify-center 
                                ${isProcessing ? "bg-blue-300" : "bg-blue-500"}
                            `}
            />
          </div>
        </div>

        {/* Round cards */}
        <div className="grid grid-cols-2 gap-4">
          {SIMULATION_STEPS.map((step) => (
            <div
              key={step.id}
              className={`
                                p-4 rounded-lg border-2 transition-all duration-300
                                ${getStepStyle(step.id)}
                                ${isProcessing && currentRound === step.id ? "" : ""}
                            `}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`
                                    rounded-full p-2
                                    ${
                                      currentRound === step.id
                                        ? "bg-blue-100"
                                        : currentRound > step.id
                                          ? "bg-green-100"
                                          : "bg-gray-100"
                                    }
                                `}
                >
                  {getStepIcon(step.id)}
                </div>
                <div>
                  <div className="font-medium">{step.name}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Control buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {!isGameStarted
              ? "Ready to begin game"
              : isGameComplete
                ? "Game completed"
                : `Round ${currentRound} of ${SIMULATION_STEPS.length - 1}`}
          </div>
          <div className="space-x-2">
            {!isGameComplete && getButtonText() && (
              <Button
                onClick={handleNextRound}
                disabled={isProcessing}
                variant="default"
                className={`
                        transition-colors
                        ${
                          !isGameStarted
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                    `}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {getButtonText()}
              </Button>
            )}
            {isGameComplete && (
              <Button
                onClick={handleReset}
                disabled={isProcessing}
                variant="outline"
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                New round
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {isGameComplete && gameState.results && gameState.rewards && (
          <div className="space-y-6">
            <div className="border-t border-gray-200" />

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Results</span>
                </h3>
                <Button
                  onClick={handleNarrator}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Narrator</span>
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-700 mb-2">
                    <Coins className="w-4 h-4" />
                    <span className="font-medium">Total Escrow</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    ${gameState.rewards.total_escrow}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700 mb-2">
                    <Trophy className="w-4 h-4" />
                    <span className="font-medium">
                      Winning Shape
                      {gameState.results.winning_shapes.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  {gameState.results.winners.length === 0 ? (
                    <div className="text-2xl font-bold text-amber-600">
                      Draw
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {gameState.results.winning_shapes.map((shape, index) => (
                        <div
                          key={index}
                          className="text-xl font-bold text-green-800 flex items-center space-x-2"
                        >
                          {getShapeIcon(shape)}
                          <span>{shape}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-purple-700 mb-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Winners</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-800">
                    {gameState.results.winners.length === 0
                      ? "Draw"
                      : gameState.results.winners.length}
                  </div>
                </div>
              </div>

              {/* Rewards Distribution */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  Rewards Distribution
                </h4>
                {gameState.results.winners.length === 0 ? (
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-amber-700">
                      Game ended in a draw - no rewards distributed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(gameState.results.choice_distribution).map(
                      ([shape, agents]) => (
                        <div key={shape} className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-700">
                            {getShapeIcon(shape)}
                            <span className="font-medium">{shape}</span>
                          </div>
                          <div className="space-y-2 pl-6">
                            {agents.map((agent) => (
                              <div
                                key={agent}
                                className="bg-white p-3 rounded-lg shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-700">
                                    {agent}
                                  </span>
                                  {gameState.rewards.winners[agent] && (
                                    <span className="text-green-600 font-bold">
                                      +$
                                      {gameState.rewards.winners[agent].reward}
                                    </span>
                                  )}
                                </div>
                                {gameState.rewards.winners[agent] && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    Initial: $
                                    {
                                      gameState.rewards.winners[agent]
                                        .initial_tokens
                                    }{" "}
                                    → Final: $
                                    {
                                      gameState.rewards.winners[agent]
                                        .final_tokens
                                    }
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameController;
