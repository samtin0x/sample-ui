import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Agent } from "@/components/types";
import { Brain, MessageSquare, Users, Bot, ArrowRight } from "lucide-react";

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

    const relevantMessages = selectedAgent && selectedChat
        ? mockChat.filter(msg =>
            (msg.agent === selectedAgent && msg.otherAgent === selectedChat) ||
            (msg.agent === selectedChat && msg.otherAgent === selectedAgent)
        )
        : [];

    const EmptyState = ({ type, className = "" }: { type: 'chat' | 'thought', className?: string }) => (
        <div className={`h-full flex flex-col items-center justify-center text-gray-400 ${className}`}>
            {type === 'chat' ? (
                <>
                    <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1 max-w-[200px] text-center text-gray-400">
                        Select an agent to view their conversation history
                    </p>
                </>
            ) : (
                <>
                    <Brain className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">No thoughts recorded</p>
                    <p className="text-xs mt-1 max-w-[200px] text-center text-gray-400">
                        Agent thought processes will appear here
                    </p>
                </>
            )}
        </div>
    );

    const getTimeString = (index: number) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - (mockChat.length - index) * 2);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center space-x-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span>Agent Communications</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Monitor conversations and thought processes between agents
                        </CardDescription>
                    </div>
                    {/*<div className="flex items-center space-x-2 text-sm text-gray-500">*/}
                    {/*    <Clock className="w-4 h-4" />*/}
                    {/*    <span>Updated </span>*/}
                    {/*</div>*/}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex space-x-4 mb-6">
                    <div className="w-[200px]">
                        <Select onValueChange={(value) => setSelectedAgent(Number(value))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Primary Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                {agents.map(agent => (
                                    <SelectItem key={agent.id} value={agent.id.toString()}>
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
                            {agents.filter(a => a.id !== selectedAgent).map(agent => (
                                <Button
                                    key={agent.id}
                                    onClick={() => setSelectedChat(agent.id)}
                                    variant={selectedChat === agent.id ? "default" : "outline"}
                                    className="transition-all duration-200 flex items-center space-x-2"
                                >
                                    <Bot className="w-4 h-4" />
                                    <span>Chat with {agent.name}</span>
                                </Button>
                            ))}
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
                                <div className="h-[500px] overflow-y-auto space-y-4 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                                    {relevantMessages.length > 0 ? (
                                        relevantMessages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`flex ${msg.agent === selectedAgent ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                                <div
                                                    className={`max-w-[80%] group transition-all duration-200 ${
                                                        msg.agent === selectedAgent
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="p-3 rounded-lg space-y-1">
                                                        <p className="text-sm">{msg.message}</p>
                                                        <p className={`text-xs ${
                                                            msg.agent === selectedAgent ? 'text-blue-100' : 'text-gray-400'
                                                        }`}>
                                                            {getTimeString(i)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState type="chat" className="py-12" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <Brain className="w-4 h-4 text-blue-500" />
                                    <span>Thought Process</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[500px] overflow-y-auto space-y-4 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                                    {relevantMessages.length > 0 ? (
                                        relevantMessages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors animate-in slide-in-from-bottom-2"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Bot className="w-4 h-4 text-gray-400" />
                                                    <p className="font-medium text-sm text-gray-600">
                                                        Agent {msg.agent}&apos;s Thought Process:
                                                    </p>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <p className="text-sm text-gray-600">{msg.thought}</p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">{getTimeString(i)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyState type="thought" className="py-12" />
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