import TipoArma from "../models/tipoArma.model.js";

const getAllTipoArmas = async (req, res) => {
    try {
        const tipoArmas = await TipoArma.findAll();
        res.status(200).json(tipoArmas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTipoArmaById = async (req, res) => {
    const { id } = req.params;
    try {
        const tipoArma = await TipoArma.findByPk(id);
        res.status(200).json(tipoArma);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createTipoArma = async (req, res) => {
    try {
        const tipoArma = await TipoArma.create({
            idTipoArma: req.body.idTipoArma,
            descripcion: req.body.descripcion
        });
        res.status(201).json(tipoArma);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTipoArma = async (req, res) => {
    const { id } = req.params;
    try {
        const tipoArma = await TipoArma.update({
            descripcion: req.body.descripcion
        }, {
            where: {
                idTipoArma: id
            }
        });
        res.status(200).json(tipoArma)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteTipoArma = async (req, res) => {
    const { id } = req.params;
    try {
        await TipoArma.destroy({
            where: {
                idTipoArma: id
            }
        });
        res.status(200).json({ message: "Tipo de arma eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllTipoArmas, getTipoArmaById, createTipoArma, updateTipoArma, deleteTipoArma };