import { RegisterUser, LoginUser } from '../../types';
import { api, removeToken, storeToken } from '../../utilities';
import { Dispatch } from './AuthContext';

export async function registerUser(dispatch: Dispatch, inputs: RegisterUser) {
    dispatch({ type: 'REGISTER_PENDING' });
    try {
        const res = await api.post('/public/register', inputs);
        dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
        const user = res.data.data;

        localStorage.setItem('user', JSON.stringify(user));
    } catch (err: any) {
        dispatch({
            type: 'REGISTER_FAILED',
            payload: err.response.data.message as string,
        });
    }
}

export async function loginUser(dispatch: Dispatch, inputs: LoginUser) {
    dispatch({ type: 'LOGIN_PENDING' });

    try {
        const res = await api.post('/public/login', inputs);
        const token = res.data.data;

        // store token in local storage
        storeToken(token);

        dispatch({ type: 'LOGIN_SUCCESS' });
    } catch (err: any) {
        console.log(err.message);
        dispatch({
            type: 'LOGIN_FAILED',
            payload: err.response.data.message as string,
        });
    }
}

export async function logoutUser(dispatch: Dispatch) {
    // remove user token from local storage
    removeToken();

    dispatch({ type: 'LOGOUT_SUCCESS' });
}
