import { useEffect, useRef } from 'react';
import { getConversations } from '../../store/Conversation/ConversationActions';
import { useConversation } from '../../store/Conversation/ConversationContext';
import { connection } from '../../utilities';

export default function ConversationList() {
    const divRef = useRef<HTMLDivElement | null>(null);

    const {
        state: { isLoading, conversations },
        dispatch,
    } = useConversation();

    useEffect(() => {
        if (conversations.length > 0) return;
        getConversations(dispatch);
    }, []);

    useEffect(() => {
        connection.on('ReceiveMessage', data => {
            dispatch({ type: 'UPDATE_CONVERSATIONS_SUCCESS', payload: data });
        });
    }, [dispatch]);

    const handleSelect = ({ id, messages, receiver, sender }: any) => {
        dispatch({
            type: 'SET_CONVERSATION',
            payload: {
                id,
                messages,
                receiver,
                sender,
            },
        });
    };

    return (
        <div className="bg-cyan-500 border-t border-gray-200/50 w-full">
            {isLoading ? (
                <FriendListLoader />
            ) : (
                <>
                    {conversations.length === 0 ? (
                        <div className="px-3 py-2 text-center text-sm">
                            No friends
                        </div>
                    ) : (
                        <>
                            {conversations.map(
                                ({ id, messages, receiver, sender }) => {
                                    const filterMessages = messages.filter(
                                        (m: any) => m.senderId === receiver.id
                                    );

                                    const lastMessage =
                                        filterMessages[
                                            filterMessages.length - 1
                                        ]?.text;

                                    return (
                                        <div
                                            key={id}
                                            className="flex py-2 px-3 cursor-pointer hover:bg-cyan-600"
                                            onClick={() =>
                                                handleSelect({
                                                    id,
                                                    messages,
                                                    receiver,
                                                    sender,
                                                })
                                            }
                                        >
                                            <img
                                                src={
                                                    receiver.imageURL ||
                                                    'assets/images/default-avatar.png'
                                                }
                                                className="w-[40px] h-[40px] bg-cover rounded-full mr-2"
                                                alt=""
                                            />
                                            <div className="">
                                                <p className="text-sm">
                                                    {receiver.username}
                                                </p>
                                                {messages.length === 0 ? (
                                                    <></>
                                                ) : (
                                                    <p
                                                        className="max-w-[228px] truncate text-xs text-neutral-50 flex-1 overflow-hidden"
                                                        ref={divRef}
                                                    >
                                                        {lastMessage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

function FriendListLoader() {
    return (
        <>
            {[1, 2, 3].map(num => (
                <div
                    className="flex items-center py-2 px-3 space-x-2"
                    key={num}
                >
                    <div className="h-[40px] w-[40px] animate-pulse bg-cyan-600 rounded-full "></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-[10px] rounded-full w-14 animate-pulse bg-cyan-600"></div>
                        <div className="h-[10px] rounded-full  animate-pulse bg-cyan-600 "></div>
                    </div>
                </div>
            ))}
        </>
    );
}
