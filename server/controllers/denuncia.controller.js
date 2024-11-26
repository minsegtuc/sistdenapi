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
import sequelize from "../config/db.js";
import { wss } from "../sockets/socketConfig.js";

const getAllDenuncias = async (req, res) => {
    const {clasificada} = req.params
    console.log(clasificada)
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
            where:{
                isClassificated: clasificada
            }

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
                    },
                    isClassificated: 1
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

const getAllRegional = async (req, res) => {
    const reg = req.body.reg ? Number(req.body.reg) : undefined;
    console.log("Regional: ", reg)
    try {
        let denuncias;
        if (!reg) {
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
                    {
                        model: Comisaria,
                    },
                    { model: TipoDelito }
                ],
                where: {
                    isClassificated: 0
                }
            });
        } else {
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
                            { model: Modalidad },
                        ]
                    },
                    {
                        model: Comisaria,
                        where: {
                            unidadRegionalId: reg
                        }
                    },
                    { model: TipoDelito }
                ],
                where: {
                    isClassificated: 0
                }

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

const denunciaTrabajando = async (req, res) => {
    try {
        const denuncia = await Denuncia.update({
            trabajando: req.body.user
        }, {
            where: {
                idDenuncia: req.body.denunciaid
            }
        }).then(() => {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'denuncia_trabajando',
                        denunciaId: req.body.denunciaid,
                        usuarioId: req.body.user
                    }));
                }
            });
        })

        await registrarLog('UPDATE', `DENUNCIA ${req.body.denunciaid} ACTUALIZADA`, req.userId);

        res.status(200).json(denuncia)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createDenuncia = async (req, res) => {
    const errores = []
    const { denuncias } = req.body

    console.log("Denuncias a cargar: ", denuncias)
    let denunciasCargadas = 0;
    let denunciasNoCargadas = 0
    const transaccion = await sequelize.transaction();

    try {
        for (const denunciaData of denuncias) {
            console.log("DenunciaData: ", denunciaData)
            let ubicacion;
            try {
                ubicacion = await Ubicacion.create({
                    latitud: denunciaData.latitud,
                    longitud: denunciaData.longitud,
                    domicilio: denunciaData.domicilio,
                    poligono: denunciaData.poligono,
                    localidadId: denunciaData.localidadId,
                    estado: denunciaData.estado
                }, { transaccion });

                const denuncia = await Denuncia.create({
                    idDenuncia: denunciaData.idDenuncia,
                    fechaDenuncia: denunciaData.fechaDenuncia,
                    dniDenunciante: denunciaData.dniDenunciante,
                    interes: denunciaData.interes,
                    aprehendido: denunciaData.aprehendido,
                    medida: denunciaData.medida,
                    seguro: denunciaData.seguro,
                    elementoSustraido: denunciaData.elementoSustraido,
                    fechaDelito: denunciaData.fechaDelito,
                    horaDelito: denunciaData.horaDelito,
                    fiscalia: denunciaData.fiscalia,
                    tipoArmaId: denunciaData.tipoArmaId,
                    movilidadId: denunciaData.movilidadId,
                    autorId: denunciaData.autorId,
                    victima: denunciaData.victima,
                    especializacionId: denunciaData.especializacionId,
                    comisariaId: denunciaData.comisariaId,
                    ubicacionId: ubicacion.idUbicacion,
                    submodalidadId: denunciaData.submodalidadId,
                    tipoDelitoId: denunciaData.tipoDelitoId,
                    isClassificated: denunciaData.isClassificated
                }, transaccion);

                await registrarLog('CREATE', `DENUNCIA ${denuncia.idDenuncia} CREADA`, req.userId);
                denunciasCargadas += 1;
            } catch (error) {
                errores.push({
                    denuncia: denunciaData,
                    error: error.message
                });

                await registrarLog('ERROR', `Fallo al crear denuncia ${denunciaData.idDenuncia}: ${error.message}`, req.userId);
                denunciasNoCargadas += 1;
            }
        }

        if (errores.length > 0) {
            await transaccion.rollback();
            console.log("Transacción revertida debido a errores en algunos registros.");
            res.status(400).json({
                message: "Transacción revertida: algunas denuncias fallaron",
                denunciasCargadas,
                denunciasNoCargadas,
                errores
            });
        } else {
            await transaccion.commit();
            res.status(201).json({
                message: "Lote de denuncias cargado con éxito",
                denunciasCargadas,
                denunciasNoCargadas,
                errores
            });
        }
    } catch (error) {
        await transaccion.rollback();
        await registrarLog('ERROR', `Error inesperado durante la transacción: ${error.message}`, req.userId);
        res.status(500).json({
            message: "Error en la carga del lote de denuncias",
            denunciasCargadas,
            denunciasNoCargadas: denuncias.length - denunciasCargadas,
            error: error.message
        });
    }
}

const updateDenuncia = async (req, res) => {
    const { id } = req.params;
    try {
        const denuncia = await Denuncia.update({
            submodalidadId: req.body.submodalidadId,
            modalidadId: req.body.modalidadId,
            especializacionId: req.body.especializacionId,
            aprehendido: req.body.aprehendido,
            medida: req.body.medida,
            movilidadId: req.body.movilidadId,
            autorId: req.body.autorId,
            seguro: req.body.seguro,
            tipoArmaId: req.body.tipoArmaId,
            victima: req.body.victima,
            elementoSustraido: req.body.elementoSustraido,
            interes: req.body.interes,
            dniDenunciante: req.body.dniDenunciante,
            tipoDelitoId: req.body.tipoDelitoId,
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

export { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllLike, getAllRegional, denunciaTrabajando };
