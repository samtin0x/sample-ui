import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Agent} from "@/components/types";
import {Brain, MessageSquare} from "lucide-react";

export const ChatRooms = ({ agents }: { agents: Agent[] }) => {
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);

    // Mock chat data
    const mockChat = [
        { agent: 1, otherAgent: 2, message: "I propose we collaborate", thought: "Trying to build trust" },
        { agent: 2, otherAgent: 1, message: "I accept your proposal", thought: "Seems beneficial for now" },
        { agent: 1, otherAgent: 2, message: "Great! Let's proceed", thought: "Partnership established" },
        { agent: 3, otherAgent: 4, message: "Hello agent 4", thought: "Making first contact" },
        { agent: 4, otherAgent: 3, message: "Hi agent 3", thought: "Being polite" }
    ];

    // Filter messages to only show conversations between the selected agents
    const relevantMessages = selectedAgent && selectedChat
        ? mockChat.filter(msg =>
            (msg.agent === selectedAgent && msg.otherAgent === selectedChat) ||
            (msg.agent === selectedChat && msg.otherAgent === selectedAgent)
        )
        : [];

    const EmptyState = ({ type }: { type: 'chat' | 'thought' }) => (
        <div className="h-full flex flex-col items-center justify-center text-gray-500">
            {type === 'chat' ? (
                <>
                    <MessageSquare className="h-12 w-12 mb-2" />
                    <p>No messages yet</p>
                </>
            ) : (
                <>
                    <Brain className="h-12 w-12 mb-2" />
                    <p>No thoughts recorded</p>
                </>
            )}
        </div>
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Agent Communications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 mb-4">
                    <Select onValueChange={(value) => setSelectedAgent(Number(value))}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Agent" />
                        </SelectTrigger>
                        <SelectContent>
                            {agents.map(agent => (
                                <SelectItem key={agent.id} value={agent.id.toString()}>
                                    {agent.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedAgent && (
                        <div className="flex space-x-2">
                            {agents.filter(a => a.id !== selectedAgent).map(agent => (
                                <Button
                                    key={agent.id}
                                    onClick={() => setSelectedChat(agent.id)}
                                    variant={selectedChat === agent.id ? "default" : "outline"}
                                >
                                    Chat with {agent.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {selectedChat && (
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Chat History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96 overflow-y-auto space-y-4 p-4">
                                    {relevantMessages.length > 0 ? (
                                        relevantMessages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`flex ${msg.agent === selectedAgent ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] p-3 rounded-lg ${
                                                        msg.agent === selectedAgent
                                                            ? 'bg-blue-500 text-white ml-auto'
                                                            : 'bg-gray-100'
                                                    }`}
                                                >
                                                    <p>{msg.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState type="chat" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Thought Process</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96 overflow-y-auto space-y-4 p-4">
                                    {relevantMessages.length > 0 ? (
                                        relevantMessages.map((msg, i) => (
                                            <div key={i} className="p-3 bg-gray-100 rounded-lg">
                                                <p className="font-medium text-sm text-gray-600">
                                                    Agent {msg.agent} thought:
                                                </p>
                                                <p className="mt-1">{msg.thought}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState type="thought" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

