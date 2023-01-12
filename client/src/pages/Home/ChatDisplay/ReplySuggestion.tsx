import { IoIosCopy } from 'react-icons/io';

export default function ReplySuggestion({
    replySuggestion,
    setReplySuggestion,
    setMessage,
}: any) {
    const handleClick = () => {
        setMessage(replySuggestion);
        setReplySuggestion("")
    };

    return (
        <div className="flex justify-between space-x-2 p-3 bg-white border-b  border-gray-300/20 ">
            <p className="flex-1 text-gray-700 font-light text-xs">
                {replySuggestion}
            </p>
            <IoIosCopy
                className="text-lg text-gray-400/80 cursor-pointer transition hover:text-cyan-400"
                onClick={handleClick}
            />
        </div>
    );
}
