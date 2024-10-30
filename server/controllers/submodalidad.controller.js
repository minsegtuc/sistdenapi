import Submodalidad from "../models/submodalidad.model.js";

const getAllSubmodalidades = async (req, res) => {
    try {
        const submodalidades = await Submodalidad.findAll();
        res.status(200).json(submodalidades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSubmodalidadById = async (req, res) => {
    const { id } = req.params;
    try {
        const submodalidad = await Submodalidad.findByPk(id);
        res.status(200).json(submodalidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getSubmodalidadByName = async (req, res) => {
    const { name } = req.params;
    try {
        const submodalidad = await Submodalidad.findOne({
            where: {
                descripcion: name
            }
        });
        res.status(200).json(submodalidad);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createSubmodalidad = async (req, res) => {
    try {
        const submodalidad = await Submodalidad.create({
            idSubmodalidad: req.body.idSubmodalidad,
            descripcion: req.body.descripcion,
            tipoDelitoId: req.body.tipoDelitoId,
            modalidadId: req.body.modalidadId
        });
        res.status(201).json(submodalidad);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSubmodalidad = async (req, res) => {
    const { id } = req.params;
    try {
        const submodalidad = await Submodalidad.update({
            descripcion: req.body.descripcion,
            tipoDelitoId: req.body.tipoDelitoId,
            modalidadId: req.body.modalidadId
        }, {
            where: {
                idSubmodalidad: id
            }
        });
        res.status(200).json(submodalidad)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteSubmodalidad = async (req, res) => {
    const { id } = req.params;
    try {
        await Submodalidad.destroy({
            where: {
                idSubmodalidad: id
            }
        });
        res.status(200).json({ message: "Submodalidad eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllSubmodalidades, getSubmodalidadById, createSubmodalidad, updateSubmodalidad, deleteSubmodalidad, getSubmodalidadByName };