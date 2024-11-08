import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card";

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

    return (
        <Card className="p-6">
            <div className="space-y-4">
                {/* Step progression visualization */}
                <div className="grid grid-cols-3 gap-4">
                    {SIMULATION_STEPS.map((step) => (
                        <div
                            key={step}
                            className={`p-4 rounded-lg border ${
                                (step === currentStep && isSimulationStarted)
                                    ? 'border-blue-500 bg-blue-50'
                                    : SIMULATION_STEPS.indexOf(currentStep) > SIMULATION_STEPS.indexOf(step) && isSimulationStarted
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200'
                            }`}
                        >
                            <div className="font-medium">{step}</div>
                        </div>
                    ))}
                </div>

                {/* Control buttons */}
                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={onStartSimulation}
                        disabled={isSimulationStarted}
                        variant="default"
                        className="bg-black"
                    >
                        Start Simulation
                    </Button>
                    <Button
                        onClick={onNextRound}
                        disabled={!isSimulationStarted}
                        variant="secondary"
                    >
                        {isLastStep ? "Run New Simulation" : "Next Step"}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
