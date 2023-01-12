import { useConversation } from '../../../store/Conversation/ConversationContext';
import ChatBlankDisplay from './ChatBlankDisplay';
import ChatDisplayHeader from './ChatDisplayHeader';
import ChatMessageList from './ChatMessageList';
import ChatTextInput from './ChatTextInput';

export default function ChatDisplay() {
    const {
        state: { conversation },
    } = useConversation();

    return (
        <div className="flex-1  bg-white rounded-tr-md rounded-br-md overflow-hidden">
            {conversation ? (
                <div className="text-black flex flex-col bg-cyan-100/50 h-full ">
                    <ChatDisplayHeader name={conversation.receiver.username} />
                    <ChatMessageList conversation={conversation} />
                    <ChatTextInput cid={conversation!.id} />
                </div>
            ) : (
                <ChatBlankDisplay />
            )}
        </div>
    );
}
