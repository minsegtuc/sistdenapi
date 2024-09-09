import UnidadRegional from "../models/unidadRegional.model.js";

const getAllUnidadesRegionales = async (req, res) => {
    try {
        const unidadRegionales = await UnidadRegional.findAll();
        res.status(200).json(unidadRegionales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUnidadRegionalById = async (req, res) => {
    const { id } = req.params;
    try {
        const unidadRegional = await UnidadRegional.findByPk(id);
        res.status(200).json(unidadRegional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUnidadRegional = async (req, res) => {
    try {
        const unidadRegional = await UnidadRegional.create({
            idUnidadRegional: req.body.idUnidadRegional,
            descripcion: req.body.descripcion,
            ubicacionId: req.body.ubicacionId
        });
        res.status(201).json(unidadRegional);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUnidadRegional = async (req, res) => {
    const { id } = req.params;
    try {
        const unidadRegional = await UnidadRegional.update({
            descripcion: req.body.descripcion,
            ubicacionId: req.body.ubicacionId
        }, {
            where: {
                idUnidadRegional: id
            }
        });
        res.status(200).json(unidadRegional)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteUnidadRegional = async (req, res) => {
    const { id } = req.params;
    try {
        await UnidadRegional.destroy({
            where: {
                idUnidadRegional: id
            }
        });
        res.status(200).json({ message: "Unidad regional eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllUnidadesRegionales, getUnidadRegionalById, createUnidadRegional, updateUnidadRegional, deleteUnidadRegional };