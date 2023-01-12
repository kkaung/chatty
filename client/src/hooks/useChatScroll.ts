import { MutableRefObject, useEffect, useRef } from 'react';

export default function useChatScroll(
    dep: any
): MutableRefObject<HTMLDivElement> {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, [dep]);

    return ref as MutableRefObject<HTMLDivElement>;
}
