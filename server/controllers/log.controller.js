import Log from "../models/log.model.js";

const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.findAll();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
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