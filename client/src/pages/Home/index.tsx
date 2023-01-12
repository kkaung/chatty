import { useEffect } from 'react';

import { useAuth } from '../../store/Auth/AuthContext';
import { getMe } from '../../store/User/UserActions';
import { useUser } from '../../store/User/UserContext';
import ChatDisplay from './ChatDisplay';
import ChatProfileHead from './ChatProfileHead';
import ChatSearchUser from './ChatSearchUser';
import ConversationList from './ConversationList';

export default function HomePage() {
    const {
        state: { isAuthenticated },
    } = useAuth();
    const {
        state: { user },
        dispatch,
    } = useUser();

    useEffect(() => {
        if (!isAuthenticated || user) return;

        getMe(dispatch);
    }, []);

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
