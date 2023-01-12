import { createContext, ReactNode, useContext, useReducer } from 'react';
import { User } from '../../types';

type Action =
    | { type: 'SEARCH_PENDING' }
    | {
          type: 'SEARCH_SUCCESS';
          payload: any;
      }
    | { type: 'ADDFRIEND_PENDING' }
    | {
          type: 'ADDFRIEND_SUCCESS';
          payload: any;
      }
    | { type: 'GETME_PENDING' }
    | { type: 'GETME_SUCCESS'; payload: any }
    | { type: 'RESET' }
    | { type: 'UPDATE_PENDING' }
    | { type: 'UPDATE_SUCCESS'; payload: any };

type State = {
    isSearching: boolean;
    isLoading: boolean;
    message: string | null;
    user: null | User;
    searchList: [] | User[] | null;
};

const initialState = {
    isSearching: false,
    isLoading: false,
    message: null,
    user: null,
    searchList: null,
};

export type Dispatch = (action: Action) => void;

type UserProviderProps = { children: ReactNode };

const UserContext = createContext<{ state: State; dispatch: Dispatch } | null>(
    null
);

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'SEARCH_PENDING': {
            return { ...state, isSearching: true };
        }
        case 'SEARCH_SUCCESS': {
            return {
                ...state,
                isLoading: false,
                message: null,
                searchList: action.payload,
                isSearching: false,
            };
        }
        case 'ADDFRIEND_PENDING': {
            return { ...state };
        }
        case 'ADDFRIEND_SUCCESS': {
            return { ...state, isLoading: false, user: action.payload };
        }
        case 'GETME_PENDING': {
            return { ...state, isLoading: true };
        }
        case 'GETME_SUCCESS': {
            return { ...state, isLoading: false, user: action.payload };
        }
        case 'RESET': {
            return { ...state, searchList: [] };
        }
        case 'UPDATE_PENDING': {
            return { ...state, isLoading: true };
        }
        case 'UPDATE_SUCCESS': {
            return { ...state, user: action.payload };
        }
    }
}

function Provider({ children }: UserProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const reset = () => {
        dispatch({ type: 'RESET' });
    };

    const value = { state, dispatch, reset };
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
}

function useUser() {
    return useContext(UserContext) as {
        dispatch: Dispatch;
        state: State;
        reset: () => void;
    };
}

export { useUser, Provider };
