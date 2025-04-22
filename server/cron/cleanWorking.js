import cron from 'node-cron';
import Working from '../models/working.model.js';
import { Op } from 'sequelize';

// Esta tarea se ejecuta cada minuto
const startCleanWorkingJob = () => {
    cron.schedule('* * * * *', async () => {
        const minutosInactivos = 3;

        const fechaLimite = new Date(Date.now() - minutosInactivos * 60 * 1000);

        try {
            const rowsDeleted = await Working.destroy({
                where: {
                    updatedAt: {
                        [Op.lt]: fechaLimite
                    }
                }
            });

            if (rowsDeleted > 0) {
                console.log(`[CLEANING] Se eliminaron ${rowsDeleted} registros inactivos de Working.`);
            }
        } catch (error) {
            console.error('[CLEANING ERROR] Error eliminando registros fantasmas:', error);
        }
    });
};

export default startCleanWorkingJob;
