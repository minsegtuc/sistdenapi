import { createLog } from '../controllers/log.controller.js';

const registrarLog = async (accion, descripcion, dniId) => {
    const req = {
        body: {
            accion: accion,
            descripcion: descripcion,
            fecha: new Date(),
            dniId
        }
    }

    const res = {
        status: (code) => (
            {
                json: (data) => {
                    console.log(data);
                }
            }
        )
    }

    await createLog(req, res);
};

export { registrarLog };