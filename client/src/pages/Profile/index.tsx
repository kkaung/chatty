import Form from '../../components/form';
import { logoutUser } from '../../store/Auth/AuthActions';
import { useAuth } from '../../store/Auth/AuthContext';
import { Link } from 'react-router-dom';
import { useUser } from '../../store/User/UserContext';
import ProfilePicture from './ProfilePicture';
import { useConversation } from '../../store/Conversation/ConversationContext';

export default function ProfilePage() {
    const { dispatch } = useAuth();
    const {
        state: { user },
        reset,
    } = useUser();
    const con = useConversation();

    const { imageURL, username, email } = user!;

    const handleClick = () => {
        logoutUser(dispatch);
        reset();
        con.reset();
    };

    return (
        <div className="flex bg-white rounded-xl px-4 p-6 shadow-sm max-w-[900px] mx-auto">
            <div className="container mx-auto space-y-4">
                <header className="mb-4">
                    <ProfilePicture imageURL={imageURL} />
                    <div className="text-xl my-2">@{username}</div>
                    <div className="">{email}</div>
                </header>
                <div>
                    <Form.Button title="Update" className="px-6 py-[6px]" />
                </div>
                <div className="space-x-4">
                    <Link to="/">
                        <Form.Button title="Back" className="px-6 py-[6px]" />
                    </Link>
                    <Form.Button
                        title="Logout"
                        className="px-6 py-[6px] bg-red-500 hover:bg-red-700"
                        onClick={handleClick}
                    />
                </div>
            </div>
        </div>
    );
}
