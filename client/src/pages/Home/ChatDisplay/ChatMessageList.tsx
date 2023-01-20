import { Link } from 'react-router-dom';
import useChatScroll from '../../../hooks/useChatScroll';
import { Conversation } from '../../../types';
import { formatTime } from '../../../utilities';

type Props = {
    conversation: Conversation | null;
};

export default function ChatMessageList({ conversation }: Props) {
    const { messages, sender, receiver } = conversation!;

    const ref = useChatScroll(messages);

    return (
        <div className="flex-1 py-3 px-6 space-y-3 overflow-y-auto" ref={ref}>
            {messages?.map(({ owner, text, createdAt }, idx) => {
                return (
                    <div key={idx}>
                        {!owner ? (
                            <div>
                                <div className="flex space-x-2">
                                    <Link to={`/${receiver.id}`}>
                                        <img
                                            src={
                                                receiver?.imageURL ||
                                                'assets/images/default-avatar.png'
                                            }
                                            className="rounded-full w-[28px] h-[28px] cursor-pointer bg-cover"
                                            alt=""
                                        />
                                    </Link>
                                    <div className="bg-white inline py-2 px-3 text-sm rounded-r rounded-b shadow-sm">
                                        {text}
                                    </div>
                                </div>
                                <div className="text-[10px] text-gray-500/50 font-light mt-[1px]">
                                    {formatTime(createdAt)}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end">
                                <div>
                                    <div className="flex space-x-2 justify-end">
                                        <div className="bg-sky-400 inline py-2 px-3 text-sm rounded-l rounded-b shadow-sm text-white">
                                            {text}
                                        </div>
                                        <Link to="profile">
                                            <img
                                                src={
                                                    sender?.imageURL ||
                                                    'assets/images/default-avatar.png'
                                                }
                                                className="rounded-full w-[28px] h-[28px] cursor-pointer bg-cover"
                                                alt=""
                                            />
                                        </Link>
                                    </div>
                                    <div className="text-[10px] text-gray-500/50 font-light text-end mt-[1px]">
                                        {formatTime(createdAt)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
