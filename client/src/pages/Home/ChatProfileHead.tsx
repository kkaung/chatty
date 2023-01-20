/* eslint-disable jsx-a11y/alt-text */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../store/User/UserContext';
import { getMe } from '../../store/User/UserActions';
import { joinConnection } from '../../utilities';

type Props = {
    username?: string;
    imageURL?: string;
};

export default function ChatProfileHead({ username, imageURL }: Props) {
    const {
        state: { isLoading },
        dispatch,
    } = useUser();

    useEffect(() => {
        joinConnection();

        getMe(dispatch);
    }, []);

    return (
        <div className="bg-cyan-600 p-3 flex items-center justify-between rounded-tl-md">
            <h1 className="font-libas italic">Chatty</h1>
            <div className="flex items-center space-x-1">
                {isLoading ? (
                    <ProfileHeadLoader />
                ) : (
                    <>
                        <Link to="/profile">
                            <img
                                src={
                                    imageURL ||
                                    'assets/images/default-avatar.png'
                                }
                                className="rounded-full w-[28px] h-[28px] cursor-pointer"
                            />
                        </Link>
                        <Link to="/profile">
                            <div className="text-sm cursor-pointer hover:underline">
                                {username}
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

function ProfileHeadLoader() {
    return (
        <>
            <div className="h-[28px] w-[28px] animate-pulse bg-cyan-700 rounded-full"></div>
            <div>
                <div className="h-[10px] rounded-full w-10 animate-pulse bg-cyan-700"></div>
                <div className="h-[6px] rounded-full w-8 animate-pulse bg-cyan-700 mt-1"></div>
            </div>
        </>
    );
}
