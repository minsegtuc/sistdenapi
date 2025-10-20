import Log from "../models/log.model.js";
import { Op } from 'sequelize';

const getAllLogs = async (req, res) => {
    try {
        // Sanitizar paginación
        const pageRaw = parseInt(req.query.page, 10);
        const pageSizeRaw = parseInt(req.query.pageSize, 10);
        const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
        const pageSize = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0 ? Math.min(pageSizeRaw, 100) : 20;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        // Normalizar filtros desde el frontend
        const userFilter = (req.query.user || req.query.usuario || '').trim();
        const actionFilter = (req.query.action || req.query.accion || '').trim();

        // where de la tabla Log
        const where = {};
        if (actionFilter) {
            // Postgres: Op.iLike; para MySQL/MariaDB usa Op.like
            where.accion = { [Op.like]: `%${actionFilter}%` };
        }

        // include para filtrar por usuario relacionado
        const include = [];
        if (userFilter) {
            // Heurística: si es numérico, filtramos por DNI; si no, por campos de Usuario (ajusta atributos reales)
            const isNumeric = /^[0-9]+$/.test(userFilter);
            if (isNumeric) {
                // Filtrar por DNI directo en Log
                where.dniId = { [Op.like]: `%${userFilter}%` };
            } else {
                include.push({
                    model: models.Usuario,
                    as: 'usuario',
                    attributes: ['dni', 'username', 'nombre', 'apellido'], // ajusta a tus columnas
                    where: {
                        [Op.or]: [
                            { username: { [Op.iLike]: `%${userFilter}%` } },
                            { nombre: { [Op.iLike]: `%${userFilter}%` } },
                            { apellido: { [Op.iLike]: `%${userFilter}%` } },
                        ],
                    },
                    required: true, // INNER JOIN para aplicar el filtro
                });
            }
        }

        const { count, rows } = await Log.findAndCountAll({
            where,
            include,
            distinct: include.length > 0, // necesario para que count sea correcto con include
            order: [['fecha', 'DESC']], // o [['fecha', 'DESC']] si prefieres
            limit,
            offset,
        });

        const totalLogs = typeof count === 'number' ? count : 0;
        const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));

        return res.status(200).json({
            logs: rows,
            totalLogs,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error('getAllLogs error:', error);
        return res.status(500).json({ message: 'Error al obtener logs' });
    }
}

const getLogById = async (req, res) => {
    const { id } = req.params;
    try {
        const log = await Log.findByPk(id);
        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createLog = async (req, res) => {
    try {
        const log = await Log.create({
            idLog: req.body.idLog,
            accion: req.body.accion,
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            dniId: req.body.dniId,
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateLog = async (req, res) => {
    const { id } = req.params;
    try {
        const log = await Log.update({
            accion: req.body.accion,
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            dniId: req.body.dniId,
        }, {
            where: {
                idLog: id
            }
        });
        res.status(200).json(log)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteLog = async (req, res) => {
    const { id } = req.params;
    try {
        await Log.destroy({
            where: {
                idLog: id
            }
        });
        res.status(200).json({ message: "Log eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllLogs, getLogById, createLog, updateLog, deleteLog };