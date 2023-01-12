import { FormEvent, useEffect, useState } from 'react';
import { CgSearch } from 'react-icons/cg';
import { IoMdClose } from 'react-icons/io';
import SearchSpinner from '../../components/loaders/SearchSpinner';
import { searchUsers } from '../../store/User/UserActions';
import { useUser } from '../../store/User/UserContext';
import ChatSearchUserList from './ChatSearchUserList';

type Props = {
    setModalShow: any;
};

export default function ChatSearchModal({ setModalShow }: Props) {
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { dispatch, state, reset } = useUser();

    const { searchList } = state;

    useEffect(() => {
        if (!search) return setIsSearching(false);

        let timeoutId: any = null;

        if (isSearching) {
            timeoutId = setTimeout(() => {
                setIsSearching(false);
                searchUsers(dispatch, search);
            }, 1000);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [dispatch, isSearching, search]);

    const handleChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement;
        setSearch(target.value);

        setIsSearching(true);
    };

    return (
        <div className="flex justify-center fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-10">
            <div className="mt-10 mb-[20rem] w-full max-w-[600px] bg-white rounded-lg">
                <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200/50 shadow-sm">
                    <div className="flex items-center flex-1">
                        {isSearching || state.isSearching ? (
                            <SearchSpinner />
                        ) : (
                            <CgSearch className="text-2xl text-gray-500/50 " />
                        )}
                        <input
                            className="w-full flex-1 outline-none ml-3 py-1 text-gray-800/80 caret-gray-800-80 "
                            placeholder="Search"
                            value={search}
                            onChange={handleChange}
                            onBlur={() => setIsSearching(false)}
                        />
                    </div>
                    <button className="p-1 rounded-full hover:bg-gray-500/10 transition">
                        <IoMdClose
                            className="text-gray-500/50 text-2xl hover:text-gray-500/70"
                            onClick={() => {
                                setModalShow(false);
                                reset();
                            }}
                        />
                    </button>
                </div>
                {searchList === null ? (
                    <></>
                ) : (
                    <>
                        {searchList.length === 0 ? (
                            <div className="text-black/90 text-center mt-2">
                                No reuslts!
                            </div>
                        ) : (
                            <ChatSearchUserList users={searchList} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
