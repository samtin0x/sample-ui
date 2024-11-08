import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Fixed import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Agent} from "@/components/types";

const GameSetup = ({ onGameStart }: { onGameStart: (agents:Agent[]) => void }) => {
    const [agentStrategies, setAgentStrategies] = useState<{ [key: number]: string }>({});

    const handleStrategyChange = (id: number, strategy: string) => {
        setAgentStrategies(prev => ({
            ...prev,
            [id]: strategy
        }));
    };

    const handleGameStart = () => {
        const agents: {
            wins: number;
            balance: number;
            shape: string;
            name: string;
            id: number;
            strategy: string
        }[] = [1, 2, 3, 4].map(id => ({
            id,
            name: `Agent ${id}`,
            balance: 1000,
            wins: 0,
            shape: 'default',
            strategy: agentStrategies[id] || ''
        }));
        onGameStart(agents);
    };

    return (
        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>Game Setup - Define Agent Personas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {[1, 2, 3, 4].map(id => (
                    <div key={id} className="space-y-2">
                        <h3 className="text-lg font-medium">Agent {id}</h3>
                        <Input
                            placeholder={`Enter strategy prompt for Agent ${id}...`}
                            className="w-full"
                            onChange={(e) => handleStrategyChange(id, e.target.value)}
                        />
                    </div>
                ))}
                <Button
                    className="w-full mt-4"
                    onClick={handleGameStart}
                    disabled={Object.keys(agentStrategies).length < 4}
                >
                    Start Game
                </Button>
            </CardContent>
        </Card>
    );
};

export default GameSetup;
