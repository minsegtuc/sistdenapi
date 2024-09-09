import TipoDelito from "../models/tipoDelito.model.js";

const getAllTipoDelitos = async (req, res) => {
    try {
        const tipoDelitos = await TipoDelito.findAll();
        res.status(200).json(tipoDelitos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTipoDelitoById = async (req, res) => {
    const { id } = req.params;
    try {
        const tipoDelito = await TipoDelito.findByPk(id);
        res.status(200).json(tipoDelito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createTipoDelito = async (req, res) => {
    try {
        const tipoDelito = await TipoDelito.create({
            idTipoDelito: req.body.idTipoDelito,
            descripcion: req.body.descripcion
        });
        res.status(201).json(tipoDelito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTipoDelito = async (req, res) => {
    const { id } = req.params;
    try {
        const tipoDelito = await TipoDelito.update({
            descripcion: req.body.descripcion
        }, {
            where: {
                idTipoDelito: id
            }
        });
        res.status(200).json(tipoDelito)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteTipoDelito = async (req, res) => {
    const { id } = req.params;
    try {
        await TipoDelito.destroy({
            where: {
                idTipoDelito: id
            }
        });
        res.status(200).json({ message: "Tipo de delito eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllTipoDelitos, getTipoDelitoById, createTipoDelito, updateTipoDelito, deleteTipoDelito };