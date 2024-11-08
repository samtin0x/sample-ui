import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, ArrowRight, RotateCcw, Check, Clock } from "lucide-react";

const SIMULATION_STEPS = ["Getting to know each other", "Negotiating", "End"] as const;
type SimulationStep = typeof SIMULATION_STEPS[number];

interface GameControlsProps {
    isSimulationStarted: boolean;
    onStartSimulation: () => void;
    onNextRound: () => void;
    currentStep: SimulationStep;
}

export const GameControls = ({
                                 isSimulationStarted,
                                 onStartSimulation,
                                 onNextRound,
                                 currentStep
                             }: GameControlsProps) => {
    const isLastStep = currentStep === "End";
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

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Control buttons */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {isSimulationStarted ?
                            `Step ${currentStepIndex + 1} of ${SIMULATION_STEPS.length}` :
                            'Ready to begin simulation'}
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            onClick={onStartSimulation}
                            disabled={isSimulationStarted}
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <Play className="w-4 h-4" />
                            <span>Start Simulation</span>
                        </Button>
                        <Button
                            onClick={onNextRound}
                            disabled={!isSimulationStarted}
                            variant="secondary"
                            className="flex items-center space-x-2"
                        >
                            {isLastStep ? (
                                <>
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Run New Simulation</span>
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="w-4 h-4" />
                                    <span>Next Step</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GameControls;