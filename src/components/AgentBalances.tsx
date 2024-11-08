import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, Square, Triangle, Trophy, TrendingUp, Wallet } from "lucide-react";
import { Agent } from "@/components/types";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const AgentBalances = ({ agents }: { agents: Agent[] }) => {
    const getShapeIcon = (shape?: string) => {
        const iconClass = "w-6 h-6";
        switch (shape) {
            case 'circle':
                return <Circle className={iconClass} />;
            case 'triangle':
                return <Triangle className={iconClass} />;
            case 'square':
                return <Square className={iconClass} />;
            default:
                return null;
        }
    };

    const maxBalance = Math.max(...agents.map(a => a.balance));
    const maxWins = Math.max(...agents.map(a => a.wins));

    return (
        <div className="relative w-full h-[450px] mb-4">
            {agents.map((agent, index) => {
                const positions = [
                    'top-0 left-0',
                    'top-0 right-0',
                    'bottom-0 left-0',
                    'bottom-0 right-0'
                ];

                const isTopPerformer = agent.balance === maxBalance;
                const isTopWinner = agent.wins === maxWins;

                return (
                    <Card
                        key={agent.id}
                        className={`
              absolute w-64 transition-all duration-300 hover:scale-105
              ${positions[index]}
              ${isTopPerformer ? 'ring-2 ring-green-400 ring-offset-2' : ''}
              shadow-lg hover:shadow-xl
            `}
                    >
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`
                    p-2 rounded-lg
                    ${isTopPerformer ? 'bg-green-100' : 'bg-gray-100'}
                  `}>
                                        {getShapeIcon(agent.shape)}
                                    </div>
                                    <CardTitle className="text-lg font-bold">
                                        {agent.name}
                                    </CardTitle>
                                </div>
                                {isTopPerformer && (
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Wallet className="w-4 h-4" />
                                        <span className="text-sm">Balance</span>
                                    </div>
                                    <span className={`font-mono font-bold ${isTopPerformer ? 'text-green-600' : ''}`}>
                    {formatCurrency(agent.balance)}
                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${(agent.balance / maxBalance) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Trophy className="w-4 h-4" />
                                        <span className="text-sm">Wins</span>
                                    </div>
                                    <span className={`font-mono font-bold ${isTopWinner ? 'text-amber-600' : ''}`}>
                    {agent.wins}
                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${(agent.wins / (maxWins || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default AgentBalances;