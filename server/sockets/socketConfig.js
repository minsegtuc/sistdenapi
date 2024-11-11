import Denuncia from "../models/denuncia.model.js";

let wss;

const userSocketMap = new Map()

export const socketConfiguration = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        socket.on('view_denuncia', async ({ denunciaId, userId }) => {
            if (!activeDenuncias.has(denunciaId)) {
                activeDenuncias.set(denunciaId, []);
            }
            activeDenuncias.get(denunciaId).push(socket.id);

            try {
                if (activeDenuncias.get(denunciaId).length === 1) {
                    await Denuncia.update({ trabajando: userId }, {
                        where: { idDenuncia: denunciaId }
                    });
                    socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId });
                }
            } catch (error) {
                console.log("Error actualizando el usuario trabajando: ", error)
            }
        });

        socket.on('leave_denuncia', async ({ denunciaId }) => {
            if (activeDenuncias.has(denunciaId)) {
                const socketsViewing = activeDenuncias.get(denunciaId).filter(id => id !== socket.id);
                if (socketsViewing.length === 0) {
                    await Denuncia.update({ trabajando: null }, {
                        where: { idDenuncia: denunciaId }
                    });
                    socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId: null });
                    activeDenuncias.delete(denunciaId);
                } else {
                    activeDenuncias.set(denunciaId, socketsViewing);
                }
            }
        });

        socket.on('disconnect', async () => {
            console.log('Usuario desconectado:', socket.id);

            activeDenuncias.forEach(async (sockets, denunciaId) => {
                if (sockets.includes(socket.id)) {
                    const remainingSockets = sockets.filter(id => id !== socket.id);

                    if (remainingSockets.length === 0) {
                        await Denuncia.update({ trabajando: null }, {
                            where: { idDenuncia: denunciaId }
                        });
                        socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId: null });
                        activeDenuncias.delete(denunciaId);
                    } else {
                        activeDenuncias.set(denunciaId, remainingSockets);
                    }
                }
            });
            console.log('Usuario desconectado:', socket.id);
        });
    });
}

export { wss };