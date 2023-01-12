export type LoginUser = { email: string; password: string };

export interface RegisterUser extends LoginUser {
    username: string;
}

export type User = {
    id: string;
    username: string;
    email: string;
    imageURL: string;
    CreatedAt: string;
    UpdatedAt: string;
    friends: User[];
};

export type Friend = {
    id: string;
    username: string;
    email: string;
    imageURL: string;
};

export type Conversation = {
    id: string;
    messages: Message[] | [];
    sender: Friend;
    receiver: Friend;
    createdAt: string;
};

export type Message = {
    id: string;
    text: string;
    createdAt: string;
    senderId: string;
    owner: boolean;
};
