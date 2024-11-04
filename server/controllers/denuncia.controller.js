import Denuncia from "../models/denuncia.model.js";
import Ubicacion from "../models/ubicacion.model.js"
import Submodalidad from "../models/submodalidad.model.js"
import Modalidad from "../models/modalidad.model.js"
import TipoDelito from "../models/tipoDelito.model.js"
import TipoArma from "../models/tipoArma.model.js"
import Movilidad from "../models/movilidad.model.js"
import Autor from "../models/autor.model.js"
import Especializacion from "../models/especializacion.model.js"
import Localidad from "../models/localidad.model.js"
import Comisaria from "../models/comisaria.model.js"
import { registrarLog } from "../helpers/logHelpers.js";
import { Op } from "sequelize";

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
                        { model: Modalidad }
                    ]
                },
                { model: Comisaria },
                { model: TipoDelito }
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
        const denuncia = await Denuncia.findByPk(id, {
            include: [
                {
                    model: Ubicacion,
                    include: [
                        { model: Localidad }
                    ]
                },
                { model: TipoArma },
                { model: Movilidad },
                { model: Autor },
                { model: Especializacion },
                {
                    model: Submodalidad,
                    include: [
                        { model: Modalidad }
                    ]
                },
                { model: Comisaria },
                { model: TipoDelito }
            ],
        });

        res.cookie('denuncia', id, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 18000000
        })

        res.status(200).json(denuncia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllLike = async (req, res) => {
    const id = req.body.denunciaSearch
    try {
        let denuncias;
        if (!id) {
            denuncias = await Denuncia.findAll({
                include: [
                    { model: Ubicacion },
                    { model: TipoArma },
                    { model: Movilidad },
                    { model: Autor },
                    { model: Especializacion },
                    {
                        model: Submodalidad,
                        include: [
                            { model: Modalidad }
                        ]
                    },
                    { model: Comisaria },
                    { model: TipoDelito }
                ],
            });
        } else {
            denuncias = await Denuncia.findAll({
                where: {
                    idDenuncia: {
                        [Op.like]: `%${id}%`
                    }
                },
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
                        ]
                    },
                    { model: Comisaria },
                    { model: TipoDelito }
                ],

            });
        }
        res.status(200).json({ denuncias });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDuplicadas = async (req, res) => {
    const ids = req.body.denunciasVerificar
    try {
        const duplicadas = await Denuncia.findAll({
            where: {
                idDenuncia: {
                    [Op.in]: ids,
                }
            }
        })
        res.status(200).json({ duplicadas })
    } catch (error) {
        console.log("Error en la consulta: ", error)
        res.status(500).json({ message: error.message });
    }
}

const createDenuncia = async (req, res) => {
    try {
        const denuncia = await Denuncia.create({
            idDenuncia: req.body.idDenuncia,
            fechaDenuncia: req.body.fechaDenuncia,
            dniDenunciante: req.body.dniDenunciante,
            interes: req.body.interes,
            aprehendido: req.body.aprehendido,
            medida: req.body.medida,
            seguro: req.body.seguro,
            elementoSustraido: req.body.elementoSustraido,
            fechaDelito: req.body.fechaDelito,
            horaDelito: req.body.horaDelito,
            fiscalia: req.body.fiscalia,
            tipoArmaId: req.body.tipoArmaId,
            movilidadId: req.body.movilidadId,
            autorId: req.body.autorId,
            victima: req.body.victima,
            especializacionId: req.body.especializacionId,
            comisariaId: req.body.comisariaId,
            ubicacionId: req.body.ubicacionId,
            submodalidadId: req.body.submodalidadId,
            tipoDelitoId: req.body.tipoDelitoId,
            isClassificated: req.body.isClassificated
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
            submodalidadId: req.body.submodalidadId,
            modalidadId: req.body.modalidadId,
            especializacionId: req.body.especializacionId,
            movilidadId: req.body.movilidadId,
            autorId: req.body.autorId,
            seguro: req.body.seguro,
            tipoArmaId: req.body.tipoArmaId,
            victima: req.body.victima,
            elementoSustraido: req.body.elementoSustraido,
            interes: req.body.interes,
            dniDenunciante: req.body.dniDenunciante,
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

const countDenunciasSC = async (req, res) => {
    try {
        const amount = await Denuncia.count({
            where: {
                isClassificated: 0
            }
        });
        res.status(200).json({ amount })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllLike };
