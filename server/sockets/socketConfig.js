import Denuncia from "../models/denuncia.model.js";
import Working from "../models/working.model.js";

let wss;

const userSocketMap = new Map()

export const socketConfiguration = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado:', socket.id);

        socket.on('view_denuncia', async ({ denunciaId, userId }) => {
            console.log("Denuncia recibida: " , denunciaId, userId)
            try {
                await Working.create({
                    idDenunciaWork: denunciaId,
                    usuario: userId
                })

                if(userSocketMap.has(socket.id)){
                    userSocketMap.delete(socket.id)
                }

                userSocketMap.set(socket.id, denunciaId);
                console.log("Mapeado socket.id:", socket.id, "con denunciaId:", denunciaId);
                
                socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId });
            } catch (error) {
                console.log("Error actualizando el usuario trabajando: ", error)
            }
        });

        socket.on('leave_denuncia', async ({ denunciaId }) => {
            console.log("Denuncia leave: ", denunciaId)
            try {
                await Working.destroy({
                    where: {
                        idDenunciaWork: denunciaId
                    }
                })

                if (userSocketMap.has(socket.id)) {
                    userSocketMap.set(socket.id);
                }

                socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId: null });
            } catch (error) {
                console.log("Error actualizando el usuario trabajando: ", error)
            }
        });

        socket.on('disconnect', async () => {
            console.log('Usuario desconectado con disconnect:', socket.id);
            console.log("Contenido actual de userSocketMap:", userSocketMap);

            const denunciaId = userSocketMap.get(socket.id);
            console.log("Denuncia en disconnect", denunciaId)

            if (denunciaId !== undefined) {
                try {
                    await Working.destroy({
                        where: {
                            idDenunciaWork: denunciaId
                        }
                    })

                    socket.broadcast.emit('denuncia_en_vista', { denunciaId, userId: null });
                } catch (error) {
                    console.log("Error actualizando el usuario trabajando en desconexión:", error);
                }

                userSocketMap.delete(socket.id);
            }
        });
    });
}

export { wss };