import { CgSearch } from 'react-icons/cg';
import { HiPlus } from 'react-icons/hi';
import { createConversation } from '../../store/Conversation/ConversationActions';
import { useConversation } from '../../store/Conversation/ConversationContext';
import { User } from '../../types';

export default function ChatSearchUserList({ users }: { users: User[] }) {
    const conversation = useConversation();

    return (
        <div className="text-black ">
            {users.map(({ id, username, imageURL }, idx) => (
                <div
                    className="py-3 px-4  flex items-center justify-between"
                    key={idx}
                >
                    <div className="flex items-center">
                        <CgSearch className="text-2xl text-gray-700/80" />
                        <span className="ml-2">{username}</span>
                    </div>
                    <div className="flex items-center">
                        <img
                            src={imageURL || 'assets/images/default-avatar.png'}
                            className="w-[40px] h-[40px] bg-cover rounded-full mr-2"
                            alt={username}
                        />
                        <button
                            className="ml-4 p-1 rounded-full transition cursor-pointer hover:bg-gray-100 disabled:bg-gray-100"
                            onClick={() => {
                                createConversation(conversation.dispatch, id);
                            }}
                            disabled={false}
                        >
                            <HiPlus className=" text-xl text-black/70 hover:text-black" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
