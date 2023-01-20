import * as signalR from '@microsoft/signalr';
import { decodeToken, getToken } from './token';

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_HUB_URL!)
    .build();

export const joinConnection = () => {
    const token = getToken();

    const uid = decodeToken(token!).nameid;

    connection
        .start()
        .then(() => {
            console.log('Connection started...');
            connection.invoke('joinConnection', uid);
        })
        .catch(() => {
            console.error('Error while starting connection');
        });
};

export const leaveConnection = async () => {
    if (connection.state !== 'Connected') return;
    await connection.stop();
};

export const joinConversation = async (cid: string) => {
    if (connection.state !== 'Connected') return;
    try {
        await connection.invoke('joinConversation', cid);
    } catch (err: any) {
        console.error(err.message);
    }
};

export const leaveConversation = async (cid: string) => {
    await connection.invoke('leaveConversation', cid);
};
