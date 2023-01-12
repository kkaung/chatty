import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

type ErrorProps = {
    message: string;
};

export function ErrorMessage({ message }: ErrorProps) {
    const [state, setState] = useState<boolean>(true);


    useEffect(() => {
        if (message !== '') setState(true);
    }, [message]);

    return state ? (
        <div className="flex justify-between items-start w-[300px] shadow-sm rounded-lg py-3 px-6 bg-white absolute right-4 text-red-500 bg-red-400/10 border-[1.5px] border-red-500/50">
            <p className="text-sm flex-1">{message}</p>
            <button onClick={() => setState(false)}>
                <IoClose className="text-gray-400/40 text-2xl border-[1.5px] rounded-full border-gray-400/40 hover:text-red-500 hover:border-red-500" />
            </button>
        </div>
    ) : (
        <></>
    );
}
