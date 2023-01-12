import { api, getAxiosConfig, getToken } from '../../utilities';
import { Dispatch } from './UserContext';

type Update = {
    imageURL?: string;
    username?: string;
    email?: string;
};

export async function searchUsers(dispatch: Dispatch, search: string) {
    dispatch({ type: 'SEARCH_PENDING' });

    try {
        const res = await api.get('/api/users', { params: { q: search } });

        const users = res.data.data;

        dispatch({ type: 'SEARCH_SUCCESS', payload: users });
    } catch (err: any) {
        console.log(err.message);
    }
}

export async function addFriend(dispatch: Dispatch, id: string) {
    dispatch({ type: 'ADDFRIEND_PENDING' });

    try {
        const token = getToken()!;
        const res = await api.get(
            `/api/users/add-friend/${id}`,
            getAxiosConfig(token)
        );

        const user = res.data.data;

        dispatch({ type: 'ADDFRIEND_SUCCESS', payload: user });
    } catch (err: any) {
        console.log(err.message);
    }
}

export async function getMe(dispatch: Dispatch) {
    dispatch({ type: 'GETME_PENDING' });

    try {
        const token = getToken()!;
        const res = await api.get('/public/me', getAxiosConfig(token));

        const user = res.data.data;

        dispatch({ type: 'GETME_SUCCESS', payload: user });
    } catch (err: any) {
        console.log(err.message);
    }
}

export async function updateUser(dispatch: Dispatch, updateBody: Update) {
    dispatch({ type: 'UPDATE_PENDING' });

    try {
        const token = getToken()!;
        const res = await api.put(
            '/api/users',
            updateBody,
            getAxiosConfig(token)
        );
        const user = res.data.data;

        dispatch({ type: 'UPDATE_SUCCESS', payload: user });
    } catch (err: any) {
        console.log(err.message);
    }
}
