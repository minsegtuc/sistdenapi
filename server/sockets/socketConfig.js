import { WebSocketServer } from "ws";

let wss;

export const socketConfiguration = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        socket.on('view_denuncia', ({ denunciaId, userId }) => {
            socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId });
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);
        });
    });
}

export {wss};