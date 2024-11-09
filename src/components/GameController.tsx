import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Check, Clock, AlertCircle, Trophy, Coins, Users, MessageCircle, Circle } from "lucide-react";
import { GameApiHandler } from "@/api/handler";
import { GameState } from "@/api/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {getShapeIcon} from "@/components/AgentBalances";

const SIMULATION_STEPS = ["Getting to know each other", "Negotiating", "End"] as const;
type SimulationStep = typeof SIMULATION_STEPS[number];
const POLLING_INTERVAL = 10000;

interface GameControlsProps {
    onGameStateUpdate?: (gameState: GameState) => void;
}

export const GameController = ({
                                 onGameStateUpdate
                             }: GameControlsProps) => {
    const [gameState, setGameState] = useState<GameState>({
        current_round: 0,
        game_status: "not_started",
        agent_states: {},
        rounds_completed: [],
        results: null,
        rewards: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Derived states
    const isSimulationStarted = gameState.game_status !== "not_started";
    const isGameComplete = gameState.results !== null;
    const currentStep: SimulationStep = (() => {
        if (!isSimulationStarted) return "Getting to know each other";
        if (gameState.current_round <= 1) return "Getting to know each other";
        if (gameState.current_round <= 2) return "Negotiating";
        return "End";
    })();

    const gameHandler = new GameApiHandler();

    // Fetch current game state
    const fetchGameState = async () => {
        try {
            setError(null);
            const state = await gameHandler.getCurrentGameState();
            setGameState(state);
            onGameStateUpdate?.(state);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch game state";
            setError(errorMessage);
            console.error("Failed to fetch game state:", error);
        }
    };

    // Start simulation
    const handleStartSimulation = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await gameHandler.startGame();
            await fetchGameState();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to start simulation";
            setError(errorMessage);
            console.error("Failed to start simulation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Setup polling interval
    useEffect(() => {
        fetchGameState();
        const intervalId = setInterval(fetchGameState, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    const handleNarrator = () => {
        // TBD: Narrator functionality
        console.log("Narrator button clicked");
    };

    const currentStepIndex = SIMULATION_STEPS.indexOf(currentStep);

    const getStepIcon = (stepIndex: number) => {
        if (!isSimulationStarted) return <Clock className="w-5 h-5 text-gray-400" />;
        if (currentStepIndex > stepIndex) return <Check className="w-5 h-5 text-green-500" />;
        if (currentStepIndex === stepIndex) return <Play className="w-5 h-5 text-blue-500" />;
        return <Clock className="w-5 h-5 text-gray-400" />;
    };

    const getStepStyle = (stepIndex: number) => {
        if (!isSimulationStarted) return "border-gray-200 bg-gray-50";
        if (currentStepIndex > stepIndex) return "border-green-500 bg-green-50 text-green-700";
        if (currentStepIndex === stepIndex) return "border-blue-500 bg-blue-50 text-blue-700";
        return "border-gray-200 bg-gray-50 text-gray-500";
    };

    return (
        <Card className="shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span>Simulation Progress</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Progress bar */}
                <div className="relative pt-4">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100">
                        <div
                            style={{ width: `${((currentStepIndex + (isSimulationStarted ? 1 : 0)) / SIMULATION_STEPS.length) * 100}%` }}
                            className="transition-all duration-500 ease-in-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                    </div>
                </div>

                {/* Step progression visualization */}
                <div className="grid grid-cols-3 gap-4">
                    {SIMULATION_STEPS.map((step, index) => (
                        <div
                            key={step}
                            className={`
                                p-4 rounded-lg border-2 transition-all duration-300
                                transform hover:scale-105
                                ${getStepStyle(index)}
                            `}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`
                                    rounded-full p-2
                                    ${currentStepIndex === index ? 'bg-blue-100' :
                                    currentStepIndex > index ? 'bg-green-100' : 'bg-gray-100'}
                                `}>
                                    {getStepIcon(index)}
                                </div>
                                <div>
                                    <div className="font-medium">{step}</div>
                                    <div className="text-xs opacity-75">
                                        {index === currentStepIndex ? 'Current' :
                                            index < currentStepIndex ? 'Completed' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                        <span className="font-medium">Winning Shape</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-800 flex items-center space-x-2">
                                        {getShapeIcon(gameState.results.winning_shape)
                                        }
                                        <span>{gameState.results.winning_shape}</span>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                                        <Users className="w-4 h-4" />
                                        <span className="font-medium">Winners</span>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-800">
                                        {gameState.results.winners.length}
                                    </div>
                                </div>
                            </div>

                            {/* Rewards Distribution */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-700 mb-3">Rewards Distribution</h4>
                                <div className="space-y-3">
                                    {Object.entries(gameState.rewards.winners).map(([agent, data]: [string, any]) => (
                                        <div key={agent} className="bg-white p-3 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">{agent}</span>
                                                <span className="text-green-600 font-bold">+${data.reward}</span>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500">
                                                Initial: ${data.initial_tokens} → Final: ${data.final_tokens}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Control buttons */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {isSimulationStarted ?
                            `Step ${currentStepIndex + 1} of ${SIMULATION_STEPS.length}` :
                            'Ready to begin simulation'}
                    </div>
                    <div>
                        <Button
                            onClick={handleStartSimulation}
                            disabled={isSimulationStarted || isLoading}
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <Play className="w-4 h-4" />
                            <span>{isLoading ? 'Starting...' : 'Start Simulation'}</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GameController;