import { api, getAxiosConfig, getToken } from '../../utilities';
import { Dispatch } from './ConversationContext';

export async function getConversations(dispatch: Dispatch) {
    dispatch({ type: 'GETCONVERSATIONS_PENDING' });

    const token = getToken()!;

    try {
        const res = await api.get('/api/conversations', getAxiosConfig(token));

        const conversations = res.data.data;

        dispatch({ type: 'GETCONVERSATIONS_SUCCESS', payload: conversations });
    } catch (err) {
        console.log(err);
    }
}

export async function createConversation(dispatch: Dispatch, fid: string) {
    dispatch({ type: 'CREATE_CONVERSATION_PENDING' });

    const token = getToken()!;

    try {
        const res = await api.post(
            `/api/conversations`,
            { fid },
            getAxiosConfig(token)
        );

        if (res.data.success) {
            dispatch({
                type: 'CREATE_CONVERSATION_SUCCESS',
                payload: res.data.data,
            });
        }
    } catch (err) {
        console.log(err);
    }
}

export async function sendMessage(cid: string, message: string) {
    const token = getToken()!;

    await api.post(
        `api/conversations/${cid}/messages`,
        {
            text: message,
        },
        getAxiosConfig(token)
    );
}
