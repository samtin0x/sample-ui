import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentBalances from "@/components/AgentBalances";
import ChatRooms from "@/components/ChatRooms";

interface GameInterfaceProps {
  gameId: string;
  era: number;
}

export const GameInterface = ({ gameId, era }: GameInterfaceProps) => {
  return (
    <div className="">
      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balances">Agent Balances</TabsTrigger>
          <TabsTrigger value="chat">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          <AgentBalances gameId={gameId} />
        </TabsContent>

        <TabsContent value="chat">
          <ChatRooms gameId={gameId} era={era} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameInterface;
