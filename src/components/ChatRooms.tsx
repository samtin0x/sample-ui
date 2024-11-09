import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Agent } from "@/components/types";
import { Brain, MessageSquare, Users, Bot, Hash } from "lucide-react";
import { GameApiHandler } from "@/api/handler";
import { Message, ThoughtProcess } from "@/api/types";

const apiHandler = new GameApiHandler();

interface GroupedMessages {
    [round: number]: Message[];
}

interface GroupedThoughts {
    [round: number]: {
        [agentName: string]: ThoughtProcess[];
    };
}

interface RoundSectionProps {
    roundNumber: number;
    messages: Message[];
    selectedAgent: string;
    getTimeString: (timestamp: string) => string;
}

const getTimeString = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const RoundSection = ({ roundNumber, messages, selectedAgent, getTimeString }: RoundSectionProps) => (
    <div className="space-y-3">
        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg sticky top-0 ">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Round {roundNumber}</span>
        </div>
        {messages.map((msg, i) => (
            <div
                key={i}
                className={`flex ${msg.from_agent === selectedAgent ? 'justify-end' : 'justify-start'}`}
            >
                <div
                    className={`
                        max-w-[80%] rounded-lg shadow-sm
                        ${msg.from_agent === selectedAgent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }
                    `}
                >
                    <div className="p-3 space-y-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <Bot className="w-3 h-3 text-current opacity-70" />
                            <span className="text-xs font-medium opacity-70">
                                {msg.from_agent} → {msg.to_agent}
                            </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs ${
                            msg.from_agent === selectedAgent ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                            {getTimeString(msg.timestamp)}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

interface ThoughtSectionProps {
    roundNumber: number;
    thoughtsByAgent: { [agent: string]: ThoughtProcess[] };
    getTimeString: (timestamp: string) => string;
}

const ThoughtSection = ({ roundNumber, thoughtsByAgent, getTimeString }: ThoughtSectionProps) => (
    <div className="space-y-3">
        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg sticky top-0">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Round {roundNumber}</span>
        </div>
        {Object.entries(thoughtsByAgent).map(([agentName, thoughts]) => (
            <div key={agentName} className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{agentName}&apos;s Thoughts:</span>
                </div>
                {thoughts.map((thought, i) => (
                    <div
                        key={i}
                        className="ml-6 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                        <p className="text-sm text-gray-600">{thought.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{getTimeString(thought.timestamp)}</p>
                    </div>
                ))}
            </div>
        ))}
    </div>
);

export const ChatRooms = ({ agents }: { agents: Agent[] }) => {
    const EmptyState = ({ type }: { type: 'chat' | 'thought' }) => (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
            {type === 'chat' ? (
                <>
                    <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1 max-w-[200px] text-center">
                        Select agents to view their conversation history
                    </p>
                </>
            ) : (
                <>
                    <Brain className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No thoughts recorded</p>
                    <p className="text-xs mt-1 max-w-[200px] text-center">
                        Agent thought processes will appear here
                    </p>
                </>
            )}
        </div>
    );

    // All states
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [groupedMessages, setGroupedMessages] = useState<GroupedMessages>({});
    const [groupedThoughts, setGroupedThoughts] = useState<GroupedThoughts>({});
    const [loading, setLoading] = useState(false);

    // All refs
    const chatScrollRef = useRef<HTMLDivElement>(null);
    const thoughtScrollRef = useRef<HTMLDivElement>(null);
    const chatScrollPosition = useRef<number>(0);
    const thoughtScrollPosition = useRef<number>(0);

    const fetchAgentInteractions = async () => {
        if (!selectedAgent || !selectedChat) return;

        // Save scroll positions
        if (chatScrollRef.current) {
            chatScrollPosition.current = chatScrollRef.current.scrollTop;
        }
        if (thoughtScrollRef.current) {
            thoughtScrollPosition.current = thoughtScrollRef.current.scrollTop;
        }

        try {
            const data = await apiHandler.getAgentInteractions(selectedAgent, selectedChat);

            const messagesByRound = (data.messages || []).reduce((acc: GroupedMessages, msg) => {
                if (!acc[msg.round_number]) {
                    acc[msg.round_number] = [];
                }
                acc[msg.round_number].push(msg);
                return acc;
            }, {});
            setGroupedMessages(messagesByRound);

            const allThoughts = await apiHandler.getAllThoughtProcesses();
            const relevantThoughts = allThoughts.filter(thought =>
                thought.agent_name === selectedAgent || thought.agent_name === selectedChat
            );

            const thoughtsByRound = relevantThoughts.reduce((acc: GroupedThoughts, thought) => {
                if (!acc[thought.round_number]) {
                    acc[thought.round_number] = {};
                }
                if (!acc[thought.round_number][thought.agent_name]) {
                    acc[thought.round_number][thought.agent_name] = [];
                }
                acc[thought.round_number][thought.agent_name].push(thought);
                return acc;
            }, {});
            setGroupedThoughts(thoughtsByRound);

            // Restore scroll positions after update
            requestAnimationFrame(() => {
                if (chatScrollRef.current) {
                    chatScrollRef.current.scrollTop = chatScrollPosition.current;
                }
                if (thoughtScrollRef.current) {
                    thoughtScrollRef.current.scrollTop = thoughtScrollPosition.current;
                }
            });
        } catch (error) {
            console.error('Failed to fetch agent interactions:', error);
        }
    };

    // Fetch on mount and set interval
    useEffect(() => {
        fetchAgentInteractions();
        const interval = setInterval(fetchAgentInteractions, 5000); // 5s
        return () => clearInterval(interval);
    }, [selectedAgent, selectedChat]);


    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center space-x-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span>Agent Communications</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Monitor conversations and thought processes between agents by round
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex space-x-4 mb-6">
                    <div className="w-[200px]">
                        <Select onValueChange={setSelectedAgent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Primary Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                {agents.map(agent => (
                                    <SelectItem key={agent.id} value={agent.name}>
                                        <div className="flex items-center space-x-2">
                                            <Bot className="w-4 h-4" />
                                            <span>{agent.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedAgent && (
                        <div className="flex space-x-2 animate-in slide-in-from-left">
                            {agents
                                .filter(a => a.name !== selectedAgent)
                                .map(agent => (
                                    <Button
                                        key={agent.id}
                                        onClick={() => setSelectedChat(agent.name)}
                                        variant={selectedChat === agent.name ? "default" : "outline"}
                                        className="flex items-center space-x-2"
                                    >
                                        <Bot className="w-4 h-4" />
                                        <span>Chat with {agent.name}</span>
                                    </Button>
                                ))
                            }
                        </div>
                    )}
                </div>

                {selectedChat ? (
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                    <span>Chat History</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    ref={chatScrollRef}
                                    className="h-[500px] overflow-y-auto space-y-6 p-4"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                        </div>
                                    ) : Object.keys(groupedMessages).length > 0 ? (
                                        Object.entries(groupedMessages)
                                            .sort(([a], [b]) => Number(a) - Number(b))
                                            .map(([round, messages]) => (
                                                <RoundSection
                                                    key={round}
                                                    roundNumber={Number(round)}
                                                    messages={messages}
                                                    selectedAgent={selectedAgent!}
                                                    getTimeString={getTimeString}
                                                />
                                            ))
                                    ) : (
                                        <EmptyState type="chat" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <Brain className="w-4 h-4 text-blue-500" />
                                    <span>Thought Processes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    ref={thoughtScrollRef}
                                    className="h-[500px] overflow-y-auto space-y-6 p-4"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                        </div>
                                    ) : Object.keys(groupedThoughts).length > 0 ? (
                                        Object.entries(groupedThoughts)
                                            .sort(([a], [b]) => Number(a) - Number(b))
                                            .map(([round, thoughtsByAgent]) => (
                                                <ThoughtSection
                                                    key={round}
                                                    roundNumber={Number(round)}
                                                    thoughtsByAgent={thoughtsByAgent}
                                                    getTimeString={getTimeString}
                                                />
                                            ))
                                    ) : (
                                        <EmptyState type="thought" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="h-[500px] flex items-center justify-center">
                        <EmptyState type="chat" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ChatRooms;
