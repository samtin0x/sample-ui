import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Play } from "lucide-react";
import {AgentConfig} from "@/api/types";
import {GameApiHandler} from "@/api/handler";

interface GameSetupProps {
    onGameStart: (gameId: string) => void;
}

const GameSetup = ({ onGameStart }: GameSetupProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ticketPrice, setTicketPrice] = useState<number>(100);
    const [agents, setAgents] = useState<AgentConfig[]>([
        { id: "Agent1", name: "Agent 1", initial_tokens: 1000, personality: "" },
        { id: "Agent2", name: "Agent 2", initial_tokens: 1000, personality: "" },
        { id: "Agent3", name: "Agent 3", initial_tokens: 1000, personality: "" },
        { id: "Agent4", name: "Agent 4", initial_tokens: 1000, personality: "" },
    ]);

    const apiHandler = new GameApiHandler();

    const handlePersonalityChange = (index: number, personality: string) => {
        setAgents(prev => prev.map((agent, i) =>
            i === index ? { ...agent, personality } : agent
        ));
    };

    const handleNameChange = (index: number, name: string) => {
        setAgents(prev => prev.map((agent, i) =>
            i === index ? { ...agent, name } : agent
        ));
    };

    const handleTokensChange = (index: number, tokens: string) => {
        const tokenValue = parseInt(tokens) || 0;
        setAgents(prev => prev.map((agent, i) =>
            i === index ? { ...agent, initial_tokens: tokenValue } : agent
        ));
    };

    const handleGameStart = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const config = {
                ticket_price: ticketPrice,
                agents: agents.map(agent => ({
                    name: agent.name.trim() || agent.id, // Fallback to ID if name is empty
                    initial_tokens: agent.initial_tokens,
                    personality: agent.personality
                })),
            };

            const createResponse = await apiHandler.createGame(config);
            onGameStart(createResponse.game_id);
        } catch (error) {
            console.error('Failed to start game:', error);
            setError(error instanceof Error ? error.message : 'Failed to start game');
        } finally {
            setIsLoading(false);
        }
    };

    const isComplete = agents.every(agent =>
        agent.personality.trim() !== '' &&
        agent.initial_tokens > 0 &&
        agent.name.trim() !== ''
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                            <CardTitle className="text-2xl font-bold">Agent Configuration</CardTitle>
                            <CardDescription className="text-gray-500">
                                Configure game settings and agent strategies
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-sm text-blue-700">
                            Set the ticket price and configure each agent&apos;s name, initial tokens, and personality.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Ticket Price
                        </label>
                        <Input
                            type="number"
                            value={ticketPrice}
                            onChange={(e) => setTicketPrice(Number(e.target.value))}
                            className="w-full"
                            min={1}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {agents.map((agent, index) => (
                            <Card key={agent.id} className="border-2 hover:border-blue-200 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                                {index + 1}
                                            </div>
                                            <div className="text-xs text-gray-500">{agent.id}</div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Agent Name
                                            </label>
                                            <Input
                                                placeholder="Enter agent name"
                                                value={agent.name}
                                                onChange={(e) => handleNameChange(index, e.target.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Initial Tokens
                                            </label>
                                            <Input
                                                type="number"
                                                value={agent.initial_tokens}
                                                onChange={(e) => handleTokensChange(index, e.target.value)}
                                                className="w-full"
                                                min={1}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Personality
                                            </label>
                                            <Input
                                                placeholder="E.g., 'Strategic and cooperative'"
                                                className="w-full"
                                                value={agent.personality}
                                                onChange={(e) => handlePersonalityChange(index, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="pt-6">
                        <Button
                            className="w-full h-12 text-lg flex items-center justify-center space-x-2"
                            onClick={handleGameStart}
                            disabled={!isComplete || isLoading}
                            variant={isComplete ? "default" : "secondary"}
                        >
                            <Play className="h-5 w-5" />
                            <span>
                {isLoading
                    ? "Starting Game..."
                    : isComplete
                        ? "Start Game"
                        : "Configure all agents to continue"}
              </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameSetup;
