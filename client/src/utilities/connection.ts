import * as signalR from '@microsoft/signalr';

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_HUB_URL!)
    .build();

export const joinConversation = async (cid: string) => {
    if (connection.state === 'Connected') await connection.stop();

    try {
        await connection.start();
        await connection.invoke('joinConversation', cid);
    } catch (err: any) {
        console.error(err.message);
    }
};

export const leaveConversation = async (cid: string) => {
    await connection.invoke('leaveConversation', cid);
    if (connection.state === 'Connected') await connection.stop();
};
