/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { useAuth } from '../../store/Auth/AuthContext';
import { useConversation } from '../../store/Conversation/ConversationContext';
import { getMe } from '../../store/User/UserActions';
import { useUser } from '../../store/User/UserContext';
import { joinConnection, joinConversation } from '../../utilities';
import ChatDisplay from './ChatDisplay';
import ChatProfileHead from './ChatProfileHead';
import ChatSearchUser from './ChatSearchUser';
import ConversationList from './ConversationList';

export default function HomePage() {
    const {
        state: { user },
    } = useUser();

    const {
        state: { conversations },
    } = useConversation();

    useEffect(() => {
        conversations.forEach(({ id }) => {
            joinConversation(id);
        });
    }, [conversations]);

    return (
        <div className="flex text-white h-full shadow-sm max-w-[900px] mx-auto">
            <div className=" max-w-[300px] w-full bg-cyan-500/80 rounded-bl-md rounded-tl-md sm:max-w-[300px]">
                <ChatProfileHead
                    username={user?.username}
                    imageURL={user?.imageURL}
                />
                <ChatSearchUser />
                <ConversationList />
            </div>
            <ChatDisplay />
        </div>
    );
}
