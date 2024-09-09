import Especializacion from "../models/especializacion.model.js";

const getAllEspecializaciones = async (req, res) => {
    try {
        const especializaciones = await Especializacion.findAll();
        res.status(200).json(especializaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEspecializacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const especializacion = await Especializacion.findByPk(id);
        res.status(200).json(especializacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createEspecializacion = async (req, res) => {
    try {
        const especializacion = await Especializacion.create({
            idEspecializacion: req.body.idEspecializacion,
            descripcion: req.body.descripcion,
        });
        res.status(201).json(especializacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateEspecializacion = async (req, res) => {
    const { id } = req.params;
    try {
        const especializacion = await Especializacion.update({
            descripcion: req.body.descripcion,
        }, {
            where: {
                idEspecializacion: id
            }
        });
        res.status(200).json(especializacion)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteEspecializacion = async (req, res) => {
    const { id } = req.params;
    try {
        await Especializacion.destroy({
            where: {
                idEspecializacion: id
            }
        });
        res.status(200).json({ message: "Especializacion eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllEspecializaciones, getEspecializacionById, createEspecializacion, updateEspecializacion, deleteEspecializacion };