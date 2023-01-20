import { createContext, ReactNode, useContext, useReducer } from 'react';
import { Conversation, Message } from '../../types';
import { getUserId } from '../../utilities';

type Action =
    | { type: 'GETCONVERSATIONS_PENDING' }
    | {
          payload: any;
          type: 'GETCONVERSATIONS_SUCCESS';
      }
    | { type: 'UPDATE_CONVERSATIONS_SUCCESS'; payload: any }
    | { type: 'SET_NEW_MESSAGE'; payload: any }
    | { type: 'SET_CONVERSATION'; payload: any }
    | { type: 'CREATE_CONVERSATION_PENDING' }
    | { type: 'CREATE_CONVERSATION_SUCCESS'; payload: any }
    | { type: 'SET_LASTMESSAGE'; payload: any }
    | { type: 'RESET' };

export type Dispatch = (action: Action) => void;

type State = {
    creating: boolean;
    isLoading: boolean;
    message: string | null;
    conversations: any[];
    conversation: null | Conversation;
    lastMessage: string | null;
};

const ConversationContext = createContext<{
    state: State;
    dispatch: Dispatch;
} | null>(null);

const initialState: State = {
    creating: false,
    isLoading: false,
    message: null,
    conversations: [],
    conversation: null,
    lastMessage: null,
};

function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'GETCONVERSATIONS_PENDING':
            return { ...state, isLoading: true };

        case 'GETCONVERSATIONS_SUCCESS':
            return {
                ...state,
                isLoading: false,
                conversations: mapConversations(action.payload),
            };

        case 'CREATE_CONVERSATION_PENDING':
            return {
                ...state,
                creating: true,
            };

        case 'CREATE_CONVERSATION_SUCCESS':
            return {
                ...state,
                creating: false,
                conversations: mapConversations(action.payload),
            };

        case 'SET_NEW_MESSAGE': {
            let conversations;

            const conversationExists = state.conversations.find(
                c => c.id === action.payload.id
            );

            if (!conversationExists) {
                conversations = [
                    mapConversation(action.payload),
                    ...state.conversations,
                ];
            } else {
                conversations = state.conversations.map(c => {
                    if (c.id === action.payload.id) {
                        const uid = getUserId();
                        const messages = mapMessages(
                            action.payload.messages,
                            uid
                        );
                        return {
                            ...c,
                            messages,
                        };
                    }
                    return c;
                });
            }

            const conversation = conversations?.find(
                c => c.id === state.conversation?.id
            );

            return {
                ...state,
                conversation,
                conversations,
            };
        }

        case 'UPDATE_CONVERSATIONS_SUCCESS':
            if (state.conversations.length === 0) {
                return {
                    ...state,
                    isLoading: false,
                };
            }

            const conversations = state.conversations.map(c => {
                if (c.id === action.payload.id) {
                    const uid = getUserId();
                    const messages = mapMessages(action.payload.messages, uid);
                    return {
                        ...c,
                        messages,
                    };
                }
                return c;
            });

            const conversation = conversations.find(
                c => c.id === state.conversation?.id
            );

            return {
                ...state,
                isLoading: false,
                conversations,
                conversation,
            };

        case 'SET_CONVERSATION':
            const receiver = action.payload.receiver;
            const filterMessages = action.payload.messages.filter(
                (m: any) => m.senderId === receiver.id
            );
            const lastMessage = filterMessages[filterMessages.length - 1]?.text;

            return {
                ...state,
                conversation: action.payload,
                lastMessage,
            };
        case 'SET_LASTMESSAGE':
            return { ...state, lastMessage: action.payload };
        case 'RESET':
            return initialState;
    }
}

function mapConversation(conversation: any) {
    const uid = getUserId();

    const c = conversation;
    const messages = mapMessages(c.messages, uid);

    const sender =
        (c.senderOne.id === uid && c.senderOne) ||
        (c.senderTwo.id === uid && c.senderTwo);
    const receiver =
        (c.senderOne.id !== uid && c.senderOne) ||
        (c.senderTwo !== uid && c.senderTwo);

    return {
        id: c.id,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        messages,
        sender,
        receiver,
    };
}

function mapConversations(conversations: Conversation[]) {
    const uid = getUserId();

    return conversations.map((c: any) => {
        const messages = mapMessages(c.messages, uid);

        const sender =
            (c.senderOne.id === uid && c.senderOne) ||
            (c.senderTwo.id === uid && c.senderTwo);
        const receiver =
            (c.senderOne.id !== uid && c.senderOne) ||
            (c.senderTwo !== uid && c.senderTwo);

        return {
            id: c.id,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            messages,
            sender,
            receiver,
        };
    });
}

function mapMessages(messages: Message[], uid: string): Message[] {
    return messages.map((m: any) => {
        if (m.senderId === uid) return { ...m, owner: true };
        return m;
    });
}

type ConversationProviderProps = { children: ReactNode };

export function Provider({ children }: ConversationProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const reset = () => dispatch({ type: 'RESET' });

    const value = { state, dispatch, reset };
    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversation() {
    return useContext(ConversationContext) as {
        state: State;
        dispatch: Dispatch;
        reset: () => void;
    };
}
