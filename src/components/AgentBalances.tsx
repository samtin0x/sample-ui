import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Circle, Square, Triangle} from "lucide-react";
import {Agent} from "@/components/types";

export const AgentBalances = ({ agents }: { agents: Agent[] }) => {
    const getShapeIcon = (shape?: string) => {
        switch (shape) {
            case 'circle': return <Circle className="w-8 h-8" />;
            case 'triangle': return <Triangle className="w-8 h-8" />;
            case 'square': return <Square className="w-8 h-8" />;
            default: return null;
        }
    };

    return (
        <div className="relative w-full h-[400px] mb-4">
            {agents.map((agent, index) => {
                const positions = [
                    'top-0 left-0',
                    'top-0 right-0',
                    'bottom-0 left-0',
                    'bottom-0 right-0'
                ];

                return (
                    <Card key={agent.id} className={`absolute w-48 ${positions[index]}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {agent.name}
                                {getShapeIcon(agent.shape)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Balance: ${agent.balance}</p>
                            <p>Wins: {agent.wins}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};


export default AgentBalances;