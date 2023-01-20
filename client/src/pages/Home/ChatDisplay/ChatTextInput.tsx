import { useEffect, useState } from 'react';
import { sendMessage } from '../../../store/Conversation/ConversationActions';
import { api, getAxiosConfig, getToken } from '../../../utilities';
import ReplySuggestion from './ReplySuggestion';
import { BsFillChatRightTextFill } from 'react-icons/bs';
import TextSearchSpinner from '../../../components/loaders/TextSearchSpinner';
import { useConversation } from '../../../store/Conversation/ConversationContext';

type Props = { cid: string };

export default function ChatTextInput({ cid }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [replySuggestion, setReplySuggestion] = useState('');

    const {
        state: { lastMessage },
    } = useConversation();

    const handleSendMessage = async () => {
        if (!message) return;

        await sendMessage(cid, message);

        setMessage('');
    };

    useEffect(() => {
        if (!cid) return;
    }, [cid]);

    const handleReplySuggestion = async () => {
        setIsLoading(true);

        const token = getToken()!;

        const res = await api.post(
            '/api/reply',
            { text: lastMessage },
            getAxiosConfig(token)
        );

        setReplySuggestion(res.data.data);

        setIsLoading(false);
    };

    return (
        <>
            {replySuggestion && (
                <ReplySuggestion
                    setMessage={setMessage}
                    replySuggestion={replySuggestion}
                    setReplySuggestion={setReplySuggestion}
                />
            )}
            <div className="p-3 bg-white flex items-center space-x-2 caret-cyan-600">
                <input
                    type="text"
                    placeholder="Type something..."
                    className="flex-1 outline-none text-black/80"
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                <div className="flex items-center space-x-4 ">
                    {!lastMessage ? (
                        <></>
                    ) : (
                        <>
                            {isLoading ? (
                                <TextSearchSpinner />
                            ) : (
                                <BsFillChatRightTextFill
                                    className="text-xl text-cyan-400 cursor-pointer transition hover:text-cyan-500"
                                    onClick={handleReplySuggestion}
                                />
                            )}
                        </>
                    )}
                    <button
                        type="button"
                        className="text-sm px-3 py-[6px] rounded bg-cyan-400 text-white transition hover:bg-cyan-500"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
}
