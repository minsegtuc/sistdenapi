import UbicacionAuxiliar from "../models/ubicacionAuxiliar.model.js";

const getAllUbicacionesAuxiliar = async (req, res) => {
    try {
        const ubicaciones = await UbicacionAuxiliar.findAll();
        res.status(200).json(ubicaciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUbicacionAuxiliarById = async (req, res) => {
    const { id } = req.params;
    try {
        const ubicacion = await UbicacionAuxiliar.findByPk(id);
        res.status(200).json(ubicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUbicacionAuxiliar = async (req, res) => {
    try {
        const ubicacion = await UbicacionAuxiliar.create({
            latitudAuxiliar: req.body.latitudAuxiliar,
            longitudAuxiliar: req.body.longitudAuxiliar,
            domicilioAuxiliar: req.body.domicilioAuxiliar,
            tipo_precision: req.body.tipo_precision,
            denunciaId: req.body.denunciaId,
            localidadId: req.body.localidadId
        });
        res.status(201).json(ubicacion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUbicacionAuxiliar = async (req, res) => {
    const { id } = req.params;
    try {
        const ubicacion = await UbicacionAuxiliar.update({
            latitudAuxiliar: req.body.latitudAuxiliar,
            longitudAuxiliar: req.body.longitudAuxiliar,
            domicilioAuxiliar: req.body.domicilioAuxiliar,
            tipo_precision: req.body.tipo_precision,
            denunciaId: req.body.denunciaId,
            localidadId: req.body.localidadId
        }, {
            where: {
                idUbicacionAuxiliar: id
            }
        });
        res.status(200).json(ubicacion)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteUbicacionAuxiliar = async (req, res) => {
    const { id } = req.params;
    try {
        await UbicacionAuxiliar.destroy({
            where: {
                idUbicacionAuxiliar: id
            }
        });
        res.status(200).json({ message: "Ubicacion eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllUbicacionesAuxiliar, getUbicacionAuxiliarById, createUbicacionAuxiliar, updateUbicacionAuxiliar, deleteUbicacionAuxiliar };