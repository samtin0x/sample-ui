import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Circle,
  Square,
  Triangle,
  TrendingUp,
  Wallet,
  Users,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { GameApiHandler } from "@/api/handler";
import { AgentState } from "@/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AgentStateMap = Record<string, AgentState>;

interface AgentBalancesProps {
  gameId: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getShapeIcon = (choice?: string) => {
  const iconClass = "w-5 h-5";
  const iconColor = choice ? "text-blue-500" : "text-gray-400";
  switch (choice?.toLowerCase()) {
    case "circle":
      return <Circle className={`${iconClass} ${iconColor}`} />;
    case "triangle":
      return <Triangle className={`${iconClass} ${iconColor}`} />;
    case "square":
      return <Square className={`${iconClass} ${iconColor}`} />;
    default:
      return <HelpCircle className={`${iconClass} ${iconColor}`} />;
  }
};

export const AgentBalances = ({ gameId }: AgentBalancesProps) => {
  const [agentStates, setAgentStates] = useState<AgentStateMap>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiHandler = new GameApiHandler();

  useEffect(() => {
    if (!gameId) {
      console.log("No gameId provided");
      setIsLoading(false);
      return;
    }

    const fetchAgentStates = async () => {
      setIsLoading(true);
      try {
        const response = await apiHandler.getAllAgents(gameId);
        setAgentStates(response);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch agent states",
        );
        setAgentStates({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentStates();
    const interval = setInterval(fetchAgentStates, 3000);

    return () => {
      console.log("Cleaning up interval");
      clearInterval(interval);
    };
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    );
  }

  const agentEntries = Object.entries(agentStates);

  if (agentEntries.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Alert>
          <AlertDescription>
            No agent data available. Please check your game ID and connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  const maxBalance = Math.max(
    ...agentEntries.map(([_, state]) => state.tokens),
  );

  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      {agentEntries.map(([agentName, state]) => (
        <Card
          key={agentName}
          className="w-full transition-all duration-300 hover:scale-102 border border-green-100 hover:border-green-200 relative overflow-hidden"
        >
          {/* Shape Choice Indicator */}
          <div className="absolute top-3 right-3 flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1.5">
            <span className="text-xs text-gray-500">Choice</span>
            {getShapeIcon(state.choice)}
          </div>

          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{agentName}</h3>
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Balance Section */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium">Balance</span>
                </div>
                <span className="font-mono font-bold text-green-600">
                  {formatCurrency(state.tokens)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(state.tokens / maxBalance) * 100}%` }}
                />
              </div>
            </div>

            {/* Allies Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Allies</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm font-medium">
                  {state.allies.length}
                </span>
              </div>
              {state.allies.length > 0 && (
                <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium">
                    Allied with:
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {state.allies.map((ally, index) => (
                      <span
                        key={ally}
                        className="inline-block bg-white px-2 py-1 rounded mr-2 mb-1 text-xs border border-gray-100"
                      >
                        {ally}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default AgentBalances;
