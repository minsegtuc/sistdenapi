import ObjetoIA from "../models/objetoIa.model";

const getAllObjetosIA = async (req, res) => {
    try {
        const objetosIA = await ObjetoIA.findAll();
        res.status(200).json(objetosIA);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getObjetoIAById = async (req, res) => {
    const { id } = req.params;
    try {
        const objetoIA = await ObjetoIA.findByPk(id);
        res.status(200).json(objetoIA);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createObjetoIA = async (req, res) => {
    const { objetoIA } = req.body;
    const errores = []

    try {
        const objetoIA = await ObjetoIA.create(req.body);
        res.status(201).json(objetoIA);
    } catch (error) {
        console.error("Error al procesar la denuncia")
        res.status(500).json({ message: error.message });
    }
}

export {getAllObjetosIA, getObjetoIAById, createObjetoIA};