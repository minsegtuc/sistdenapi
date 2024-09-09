import Comisaria from "../models/comisaria.model.js";
import { registrarLog } from "../helpers/logHelpers.js";

const getAllComisarias = async (req, res) => {
    try {
        const comisarias = await Comisaria.findAll();
        res.status(200).json(comisarias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getComisariaById = async (req, res) => {
    const { id } = req.params;
    try {
        const comisaria = await Comisaria.findByPk(id);
        res.status(200).json(comisaria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createComisaria = async (req, res) => {
    try {
        const comisaria = await Comisaria.create({
            idComisaria: req.body.idComisaria,
            descripcion: req.body.descripcion,
            telefono: req.body.telefono,
            localidadId: req.body.localidadId,
            ubicacionId: req.body.ubicacionId,
            unidadRegionalId: req.body.unidadRegionalId
        });

        // await registrarLog('CREATE', `COMISARIA ${comisaria.idComisaria} CREADA`, req.body.dniId);

        res.status(201).json(comisaria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateComisaria = async (req, res) => {
    const { id } = req.params;
    try {
        const comisaria = await Comisaria.update({
            descripcion: req.body.descripcion,
            telefono: req.body.telefono,
            localidadId: req.body.localidadId,
            ubicacionId: req.body.ubicacionId,
            unidadRegionalId: req.body.unidadRegionalId
        }, {
            where: {
                idComisaria: id
            }
        });

        // await registrarLog('UPDATE', `COMISARIA ${id} ACTUALIZADA`, req.body.dniId);

        res.status(200).json(comisaria)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteComisaria = async (req, res) => {
    const { id } = req.params;
    try {
        const comisaria = await Comisaria.destroy({
            where: {
                idComisaria: id
            }
        });

        // await registrarLog('DELETE', `COMISARIA ${id} ELIMINADA`, req.body.dniId);
        
        res.status(200).json(comisaria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllComisarias, getComisariaById, createComisaria, updateComisaria, deleteComisaria };