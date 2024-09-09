import Departamento from "../models/departamento.model.js";

const getAllDepartamentos = async (req, res) => {
    try {
        const departamentos = await Departamento.findAll();
        res.status(200).json(departamentos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDepartamentoById = async (req, res) => {
    const { id } = req.params;
    try {
        const departamento = await Departamento.findByPk(id);
        res.status(200).json(departamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createDepartamento = async (req, res) => {
    try {
        const departamento = await Departamento.create({
            idDepartamento: req.body.idDepartamento,
            descripcion: req.body.descripcion,
        });
        res.status(201).json(departamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateDepartamento = async (req, res) => {
    const { id } = req.params;
    try {
        const departamento = await Departamento.update({
            descripcion: req.body.descripcion,
        }, {
            where: {
                idDepartamento: id
            }
        });
        res.status(200).json(departamento)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteDepartamento = async (req, res) => {
    const { id } = req.params;
    try {
        await Departamento.destroy({
            where: {
                idDepartamento: id
            }
        });
        res.status(200).json({ message: "Departamento eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllDepartamentos, getDepartamentoById, createDepartamento, updateDepartamento, deleteDepartamento };