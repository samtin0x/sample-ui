"use client";

import React, { useState, useEffect } from "react";
import { Toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GameInterface from "@/components/main/GameInterface";
import GameSetup from "@/components/main/GameSetup";
import { GameController } from "@/components/GameController";
import { AgentState, Game, GameState } from "@/api/types";
import { GameApiHandler } from "@/api/handler";
import GameList from "@/components/GameList";
import { useToast } from "@/hooks/use-toast";

export type Step = "Getting to know each other" | "Negotiating" | "End";
const SIMULATION_STEPS: Step[] = [
  "Getting to know each other",
  "Negotiating",
  "End",
];
const POLLING_INTERVAL = 15000;

export default function GamePage() {
  // State management
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    started: false,
    gameId: null,
    simulationStarted: false,
    currentStep: "Getting to know each other",
  });

  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>(
    {},
  );
  const apiHandler = new GameApiHandler();
  const { toast } = useToast();

  // Fetch existing games
  const fetchGames = async () => {
    try {
      setIsLoadingGames(true);
      setError(null);
      const gameList = await apiHandler.listGames();
      setGames(gameList);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch games";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error fetching games",
        description: errorMessage,
      });
    } finally {
      setIsLoadingGames(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGames();
  }, []);

  // Handle game creation
  const handleGameCreate = async (gameId: string) => {
    try {
      setGameState({
        started: true,
        gameId,
        era: 1,
        simulationStarted: false,
        currentStep: "Getting to know each other",
      });

      toast({
        title: "Game created successfully",
        description: `Game ID: ${gameId}`,
      });

      await fetchGames(); // Refresh games list
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create game";
      toast({
        variant: "destructive",
        title: "Error creating game",
        description: errorMessage,
      });
    }
  };

  // Handle game selection
  const handleGameSelect = async (gameId: string) => {
    try {
      // Get the selected game's details
      const selectedGame = games.find((game) => game.game_id === gameId);
      if (!selectedGame) throw new Error("Selected game not found");

      setGameState({
        started: true,
        gameId,
        era: selectedGame.era,
        simulationStarted: selectedGame.current_round !== null,
        currentStep: "Getting to know each other", // You might want to derive this from game state
      });

      toast({
        title: "Game selected",
        description: `Joined game with ID: ${gameId.slice(0, 8)}...`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to select game";
      toast({
        variant: "destructive",
        title: "Error selecting game",
        description: errorMessage,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">✨Purelands</h1>
          {gameState.started && (
            <Button
              variant="outline"
              onClick={() =>
                setGameState({
                  started: false,
                  gameId: null,
                  simulationStarted: false,
                  currentStep: "Getting to know each other",
                })
              }
            >
              Exit Game
            </Button>
          )}
        </div>

        <Separator />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!gameState.started ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Games</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchGames}
                disabled={isLoadingGames}
              >
                <RefreshCcw
                  className={`h-4 w-4 mr-2 ${isLoadingGames ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>

            <GameList
              games={games}
              onSelectGame={handleGameSelect}
              onRefresh={fetchGames}
              isLoading={isLoadingGames}
              selectedGameId={gameState.gameId}
            />

            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Create New Game</h2>
              <GameSetup onGameStart={handleGameCreate} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {gameState.gameId && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Game Control Panel</h2>
                  <div className="text-sm text-gray-500">
                    Game ID: {gameState.gameId}
                  </div>
                </div>

                <GameController gameId={gameState.gameId} />
                <GameInterface gameId={gameState.gameId} era={gameState.era} />
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
