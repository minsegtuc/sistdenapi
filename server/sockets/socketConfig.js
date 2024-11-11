import Denuncia from "../models/denuncia.model.js";

let wss;

const userSocketMap = new Map()

export const socketConfiguration = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        socket.on('view_denuncia', async ({ denunciaId, userId }) => {
            try {

                userSocketMap.set(socket.id, { userId, denunciaId })

                await Denuncia.update({ trabajando: userId }, {
                    where: { idDenuncia: denunciaId }
                })
                socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId });
            } catch (error) {
                console.log("Error actualizando el usuario trabajando: ", error)
            }
        });

        socket.on('leave_denuncia', async ({ denunciaId }) => {
            console.log("Denuncia leave: ", denunciaId)
            try {
                await Denuncia.update({ trabajando: null }, {
                    where: { idDenuncia: denunciaId }
                })
                socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId: null });

                userSocketMap.delete(socket.id)
            } catch (error) {
                console.log("Error actualizando el usuario trabajando: ", error)
            }
        });

        socket.on('disconnect', async () => {
            console.log('Usuario desconectado:', socket.id);

            const userData = userSocketMap.get(socket.id)
            if (userData) {
                const { userId, denunciaId } = userData;

                userSocketMap.delete(socket.id);

                const stillViewing = Array.from(userSocketMap.values()).some(
                    (data) => data.userId === userId && data.denunciaId === denunciaId
                );

                if (!stillViewing) {
                    try {
                        await Denuncia.update({ trabajando: null }, {
                            where: { idDenuncia: denunciaId }
                        })

                        socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId: null });
                    } catch (error) {
                        console.log("Error al liberar la denuncia")
                    }
                }
            }
        });
    });
}

export { wss };