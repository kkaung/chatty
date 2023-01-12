import * as signalR from '@microsoft/signalr';

export const connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5141/hub')
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

export const receiveMessage = () => {
    // connection.on('ReceiveMessage', data => {
    //     console.log(data);
    // });
};
