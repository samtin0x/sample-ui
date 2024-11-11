import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, List, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Game } from "@/api/types";
import { SIMULATION_STEPS } from "@/components/GameController";

interface GameListProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  selectedGameId?: string | null;
}

const GameList = ({
  games,
  onSelectGame,
  isLoading = false,
}: GameListProps) => {
  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <List className="h-5 w-5" />
            <span>Loading existing games...</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (games.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <List className="h-5 w-5" />
            <span>No existing games</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <List className="h-5 w-5" />
            <span>Existing Games</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {games.map((game) => (
              <Card
                key={game.game_id}
                className="border-2 hover:border-blue-200"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Game ID:</div>
                      <div className="text-sm text-gray-500">
                        {game.game_id}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Ticket Price:</div>
                      <div className="text-sm text-gray-500">
                        {game.ticket_price}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Agents:</div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-sm text-gray-500 cursor-help">
                            <Users className="h-4 w-4 mr-1" />
                            {game.agents.length}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="space-y-2">
                            {game.agents.map((agent, index) => (
                              <div
                                key={index}
                                className="border-b last:border-b-0 pb-2 last:pb-0"
                              >
                                <div className="font-medium">{agent.name}</div>
                                <div className="text-sm text-gray-400">
                                  {agent.personality}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Current Round:</div>
                      <div className="text-sm text-gray-500">
                        {SIMULATION_STEPS[game?.current_round]?.name ||
                          "Round finished"}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => onSelectGame(game.game_id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Select Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default GameList;
