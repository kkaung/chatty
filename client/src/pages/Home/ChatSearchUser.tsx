import { useState } from 'react';
import { CgSearch } from 'react-icons/cg';
import ChatSearchModal from './ChatSearchModal';

export default function ChatSearchUser() {
    const [modalShow, setModalShow] = useState<boolean>(false);

    return (
        <>
            {modalShow && <ChatSearchModal setModalShow={setModalShow} />}
            <div
                className="flex items-center py-1 px-3 w-full cursor-pointer border-b-[1px] border-gray-100/10 hover:bg-cyan-500"
                onClick={() => setModalShow(true)}
            >
                <CgSearch className="text-xl text-white/80" />
                <span className="font-light ml-2 text-white/80">
                    Find a user
                </span>
            </div>
        </>
    );
}
