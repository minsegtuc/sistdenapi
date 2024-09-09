import Localidad from "../models/localidad.model.js";

const getAllLocalidades = async (req, res) => {
    try {
        const localidades = await Localidad.findAll();
        res.status(200).json(localidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getLocalidadById = async (req, res) => {
    const { id } = req.params;
    try {
        const localidad = await Localidad.findByPk(id);
        res.status(200).json(localidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createLocalidad = async (req, res) => {
    try {
        const localidad = await Localidad.create({
            idLocalidad: req.body.idLocalidad,
            descripcion: req.body.descripcion,
            departamentoId: req.body.departamentoId,
        });
        res.status(201).json(localidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateLocalidad = async (req, res) => {
    const { id } = req.params;
    try {
        const localidad = await Localidad.update({
            descripcion: req.body.descripcion,
            departamentoId: req.body.departamentoId,
        }, {
            where: {
                idLocalidad: id
            }
        });
        res.status(200).json(localidad)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteLocalidad = async (req, res) => {
    const { id } = req.params;
    try {
        await Localidad.destroy({
            where: {
                idLocalidad: id
            }
        });
        res.status(200).json({ message: "Localidad eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllLocalidades, getLocalidadById, createLocalidad, updateLocalidad, deleteLocalidad };

