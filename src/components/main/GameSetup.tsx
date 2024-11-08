import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Play } from "lucide-react";
import { Agent } from "@/components/types";

const GameSetup = ({ onGameStart }: { onGameStart: (agents: Agent[]) => void }) => {
    const [agentStrategies, setAgentStrategies] = useState<{ [key: number]: string }>({});

    const handleStrategyChange = (id: number, strategy: string) => {
        setAgentStrategies(prev => ({
            ...prev,
            [id]: strategy
        }));
    };

    const handleGameStart = () => {
        const agents: Agent[] = [1, 2, 3, 4].map(id => ({
            id,
            name: `Agent ${id}`,
            balance: 1000 + id,
            wins: 0,
            shape: 'default',
            strategy: agentStrategies[id] || ''
        }));
        onGameStart(agents);
    };

    const filledStrategies = Object.keys(agentStrategies).length;
    const isComplete = filledStrategies === 4;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="shadow-lg">
                <CardHeader className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                            <CardTitle className="text-2xl font-bold">Agent Configuration</CardTitle>
                            <CardDescription className="text-gray-500">
                                Define unique strategies for each AI agent before starting the game
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Alert className="bg-blue-50 border-blue-200">
                        <AlertDescription className="text-sm text-blue-700">
                            Each agent can be given a unique personality and strategy. Be creative with your prompts!
                        </AlertDescription>
                    </Alert>

                    <div className="grid gap-6 md:grid-cols-2">
                        {[1, 2, 3, 4].map(id => (
                            <Card key={id} className="border-2 hover:border-blue-200 transition-colors">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                                {id}
                                            </div>
                                            <h3 className="text-lg font-semibold">Agent {id}</h3>
                                        </div>
                                        <Input
                                            placeholder="E.g., 'Aggressive trader who takes risks...'"
                                            className="w-full border-2"
                                            value={agentStrategies[id] || ''}
                                            onChange={(e) => handleStrategyChange(id, e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="pt-6">
                        <Button
                            className="w-full h-12 text-lg flex items-center justify-center space-x-2"
                            onClick={handleGameStart}
                            disabled={!isComplete}
                            variant={isComplete ? "default" : "secondary"}
                        >
                            <Play className="h-5 w-5" />
                            <span>
                {isComplete
                    ? "Start Game"
                    : `Configure ${4 - filledStrategies} more agent${4 - filledStrategies > 1 ? 's' : ''}`
                }
              </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameSetup;