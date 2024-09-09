import Denuncia from "../models/denuncia.model.js";
import Ubicacion from "../models/ubicacion.model.js"
import Submodalidad from "../models/submodalidad.model.js"
import Modalidad from "../models/modalidad.model.js"
import TipoDelito from "../models/tipoDelito.model.js"
import TipoArma from "../models/tipoArma.model.js"
import Movilidad from "../models/movilidad.model.js"
import Autor from "../models/autor.model.js"
import Especializacion from "../models/especializacion.model.js"
import { registrarLog } from "../helpers/logHelpers.js";

const getAllDenuncias = async (req, res) => {
    try {
        const denuncias = await Denuncia.findAll({
            include: [
                { model: Ubicacion },
                { model: TipoArma },
                { model: Movilidad },
                { model: Autor },
                { model: Especializacion },
                {
                    model: Submodalidad,
                    include: [
                        { model: Modalidad },
                        { model: TipoDelito }
                    ]
                }
            ],

        });
        res.status(200).json(denuncias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDenunciaById = async (req, res) => {
    const { id } = req.params;
    try {
        const denuncia = await Denuncia.findByPk(id);
        res.status(200).json(denuncia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createDenuncia = async (req, res) => {
    try {
        const denuncia = await Denuncia.create({
            idDenuncia: req.body.idDenuncia,
            fechaDenuncia: req.body.fechaDenuncia,
            interes: req.body.interes,
            aprehendido: req.body.aprehendido,
            medida: req.body.medida,
            seguro: req.body.seguro,
            elementoSustraido: req.body.elementoSustraido,
            fechaDelito: req.body.fechaDelito,
            fiscalia: req.body.fiscalia,
            tipoArmaId: req.body.tipoArmaId,
            movilidadId: req.body.movilidadId,
            autorId: req.body.autorId,
            victima: req.body.victima,
            especializacionId: req.body.especializacionId,
            comisariaId: req.body.comisariaId,
            ubicacionId: req.body.ubicacionId,
            submodalidadId: req.body.submodalidadId,
            isClassificated: 0
        });

        await registrarLog('CREATE', `DENUNCIA ${denuncia.idDenuncia} CREADA`, req.userId);

        res.status(201).json(denuncia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateDenuncia = async (req, res) => {
    const { id } = req.params;
    try {
        const denuncia = await Denuncia.update({
            fechaDenuncia: req.body.fechaDenuncia,
            interes: req.body.interes,
            aprehendido: req.body.aprehendido,
            medida: req.body.medida,
            seguro: req.body.seguro,
            elementoSustraido: req.body.elementoSustraido,
            fechaDelito: req.body.fechaDelito,
            fiscalia: req.body.fiscalia,
            tipoArmaId: req.body.tipoArmaId,
            movilidadId: req.body.movilidadId,
            autorId: req.body.autorId,
            victima: req.body.victima,
            especializacionId: req.body.especializacionId,
            comisariaId: req.body.comisariaId,
            ubicacionId: req.body.ubicacionId,
            submodalidadId: req.body.submodalidadId,
            isClassificated: req.body.isClassificated
        }, {
            where: {
                idDenuncia: id
            }
        });

        await registrarLog('UPDATE', `DENUNCIA ${id} ACTUALIZADA`, req.userId);

        res.status(200).json(denuncia)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteDenuncia = async (req, res) => {
    const { id } = req.params;
    try {
        const denuncia = await Denuncia.destroy({
            where: {
                idDenuncia: id
            }
        });

        await registrarLog('DELETE', `DENUNCIA ${id} ELIMINADA`, req.userId);

        res.status(200).json(denuncia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia };
