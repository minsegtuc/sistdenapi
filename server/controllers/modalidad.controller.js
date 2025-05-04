import Modalidad from "../models/modalidad.model.js";
import TipoDelito from "../models/tipoDelito.model.js";

const getAllModalidades = async (req, res) => {
    try {
        const modalidades = await Modalidad.findAll();
        res.status(200).json(modalidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getModalidadById = async (req, res) => {
    const { id } = req.params;
    try {
        const modalidad = await Modalidad.findByPk(id, {
            include: {
                model: TipoDelito
            }
        });
        res.status(200).json(modalidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createModalidad = async (req, res) => {
    try {
        const modalidad = await Modalidad.create({
            idModalidad: req.body.idModalidad,
            descripcion: req.body.descripcion,
            tipoDelitoId: req.body.tipoDelitoId
        });
        res.status(201).json(modalidad);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateModalidad = async (req, res) => {
    const { id } = req.params;
    try {
        const modalidad = await Modalidad.update({
            descripcion: req.body.descripcion,
        }, {
            where: {
                idModalidad: id
            }
        });
        res.status(200).json(modalidad)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteModalidad = async (req, res) => {
    const { id } = req.params;
    try {
        await Modalidad.destroy({
            where: {
                idModalidad: id
            }
        });
        res.status(200).json({ message: "Modalidad eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllModalidades, getModalidadById, createModalidad, updateModalidad, deleteModalidad };