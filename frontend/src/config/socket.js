import socket from 'socket.io-client';

let socketInstance = null;

export const getSocket = (projectId) => {

    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        },
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Connection Error:', error);
    });

    socketInstance.on('disconnect', (reason) => {
        console.warn('Disconnected:', reason);
    });


    return socketInstance;

}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data); 
}