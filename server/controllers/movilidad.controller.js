import Movilidad from "../models/movilidad.model.js";

const getAllMovilidades = async (req, res) => {
    try {
        const movilidades = await Movilidad.findAll();
        res.status(200).json(movilidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMovilidadById = async (req, res) => {
    const { id } = req.params;
    try {
        const movilidad = await Movilidad.findByPk(id);
        res.status(200).json(movilidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createMovilidad = async (req, res) => {
    try {
        const movilidad = await Movilidad.create({
            idMovilidad: req.body.idMovilidad,
            descripcion: req.body.descripcion
        });
        res.status(201).json(movilidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateMovilidad = async (req, res) => {
    const { id } = req.params;
    try {
        const movilidad = await Movilidad.update({
            descripcion: req.body.descripcion
        }, {
            where: {
                idMovilidad: id
            }
        });
        res.status(200).json(movilidad)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteMovilidad = async (req, res) => {
    const { id } = req.params;
    try {
        await Movilidad.destroy({
            where: {
                idMovilidad: id
            }
        });
        res.status(200).json({ message: "Movilidad eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllMovilidades, getMovilidadById, createMovilidad, updateMovilidad, deleteMovilidad };