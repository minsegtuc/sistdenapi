import Ubicacion from "../models/ubicacion.model.js";

const getAllUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.findAll();
        res.status(200).json(ubicaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUbicacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const ubicacion = await Ubicacion.findByPk(id);
        res.status(200).json(ubicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUbicacion = async (req, res) => {
    try {
        const ubicacion = await Ubicacion.create({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            domicilio: req.body.domicilio,
            poligono: req.body.poligono,
            localidadId: req.body.localidadId
        });
        res.status(201).json(ubicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUbicacion = async (req, res) => {
    const { id } = req.params;
    try {
        const ubicacion = await Ubicacion.update({
            latitud: req.body.latitud,
            longitud: req.body.longitud,
            domicilio: req.body.domicilio,
            poligono: req.body.poligono
        }, {
            where: {
                idUbicacion: id
            }
        });
        res.status(200).json(ubicacion)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteUbicacion = async (req, res) => {
    const { id } = req.params;
    try {
        await Ubicacion.destroy({
            where: {
                idUbicacion: id
            }
        });
        res.status(200).json({ message: "Ubicacion eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllUbicaciones, getUbicacionById, createUbicacion, updateUbicacion, deleteUbicacion };