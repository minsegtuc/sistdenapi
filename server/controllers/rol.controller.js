import Rol from "../models/rol.model.js";

const getAllRol = async (req, res) => {
    try {
        const rol = await Rol.findAll();
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRolById = async (req, res) => {
    const { id } = req.params;
    try {
        const rol = await Rol.findByPk(id);
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createRol = async (req, res) => {
    try {
        const rol = await Rol.create({
            descripcion: req.body.descripcion,
        });
        res.status(201).json(rol);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateRol = async (req, res) => {
    const { id } = req.params;
    try {
        const rol = await Rol.update({
            descripcion: req.body.descripcion,
        }, {
            where: {
                idRol: id
            }
        });
        res.status(200).json(rol)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteRol = async (req, res) => {
    const { id } = req.params;
    try {
        await Rol.destroy({
            where: {
                idRol: id
            }
        });
        res.status(200).json({ message: "Rol eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllRol, getRolById, createRol, updateRol, deleteRol };