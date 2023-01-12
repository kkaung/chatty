import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utilities';

export default function FriendPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [friend, setFriend] = useState({
        imageURL: '',
        username: '',
        email: '',
    });

    const { email, imageURL, username } = friend!;

    const { id } = useParams();

    useEffect(() => {
        getUserById();
    }, []);

    async function getUserById() {
        setIsLoading(true);

        try {
            const res = await api.get(`api/users/${id}`);

            setFriend(res.data.data);
        } catch (err) {
            console.log(err);
        }

        setIsLoading(false);
    }

    return (
        <div className="flex bg-white rounded-xl px-4 p-6 shadow-sm max-w-[900px] mx-auto">
            <div className="container mx-auto space-y-4">
                {isLoading || !friend ? (
                    <div>Loading....</div>
                ) : (
                    <header className="mb-4">
                        <img
                            src={imageURL || 'assets/images/default-avatar.png'}
                            className="rounded-full w-[60px] h-[60px]"
                            alt="profile"
                        />
                        <div className="text-xl my-2">@{username}</div>
                        <div className="">{email}</div>
                    </header>
                )}
            </div>
        </div>
    );
}
