import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<any> {
    isLoading?: boolean;
}

export default function SubmitButton({
    title,
    className,
    isLoading,
    ...props
}: Props) {
    return (
        <button
            className={`${className} ${
                isLoading ? 'bg-cyan-700' : 'bg-cyan-500'
            } px-4 py-2 rounded-md text-white hover:bg-cyan-700`}
            {...props}
        >
            {isLoading ? 'Loading...' : title}
        </button>
    );
}
