import {ChatRooms} from "@/components/ChatRooms";
import {AgentBalances} from "@/components/AgentBalances";
import {Agent} from "@/components/types";

const GameInterface = ({ agents }: { agents: Agent[] }) => {
    return (
        <div className="p-6 space-y-6">
            <AgentBalances agents={agents} />
            <ChatRooms agents={agents} />
        </div>
    );
};

export default GameInterface;
