import {
    useReducer,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from 'react';
import { registerUser, loginUser } from './AuthActions';
import type { User } from '../../types';
import { getToken } from '../../utilities';

type Action =
    | { type: 'REGISTER_PENDING' }
    | {
          payload: any;
          type: 'REGISTER_SUCCESS';
      }
    | {
          type: 'REGISTER_FAILED';
          payload: string;
      }
    | { type: 'LOGIN_PENDING' }
    | { type: 'LOGIN_SUCCESS' }
    | { type: 'LOGIN_FAILED'; payload: any }
    | { type: 'LOGOUT_SUCCESS' }
    | { type: 'GETME_PENDING' }
    | { type: 'GETME_SUCCESS'; payload: any };

export type Dispatch = (action: Action) => void;
type State = {
    isLoading: boolean;
    isAuthenticated: boolean;
    message: string | null;
    user: null | User;
};
type AuthProviderProps = { children: ReactNode };

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    message: null,
    user: null,
};

const AuthContext = createContext<{ state: State; dispatch: Dispatch } | null>(
    null
);

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'REGISTER_PENDING': {
            return { ...state, isLoading: true };
        }
        case 'REGISTER_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload,
                message: null,
            };
        }
        case 'REGISTER_FAILED': {
            return {
                ...state,
                isLoading: false,
                message: action.payload,
            };
        }
        case 'LOGIN_PENDING': {
            return { ...state, isLoading: true };
        }
        case 'LOGIN_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
            };
        }
        case 'LOGIN_FAILED': {
            return { ...state, isLoading: false, message: action.payload };
        }
        case 'LOGOUT_SUCCESS': {
            return initialState;
        }
        case 'GETME_PENDING': {
            return { ...state, isLoading: true };
        }
        case 'GETME_SUCCESS': {
            return { ...state, isLoading: false, user: action.payload };
        }
        // default: {
        //     throw new Error(`Unhandled action type: ${action.type}`);
        // }
    }
}

function Provider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Check the user when the browser reloaded
    useEffect(() => {
        const token = getToken();

        if (!token) return;

        dispatch({ type: 'LOGIN_SUCCESS' });
    }, []);

    const value = { state, dispatch };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext) as { state: State; dispatch: Dispatch };
}

export { Provider, useAuth, registerUser, loginUser };
