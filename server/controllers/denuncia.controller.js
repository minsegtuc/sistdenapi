import Denuncia from "../models/denuncia.model.js";
import Ubicacion from "../models/ubicacion.model.js"
import UbicacionAuxiliar from "../models/ubicacionAuxiliar.model.js"
import Submodalidad from "../models/submodalidad.model.js"
import Modalidad from "../models/modalidad.model.js"
import TipoDelito from "../models/tipoDelito.model.js"
import TipoArma from "../models/tipoArma.model.js"
import Movilidad from "../models/movilidad.model.js"
import Autor from "../models/autor.model.js"
import Especializacion from "../models/especializacion.model.js"
import Localidad from "../models/localidad.model.js"
import Comisaria from "../models/comisaria.model.js"
import UnidadRegional from "../models/unidadRegional.model.js"
import { registrarLog } from "../helpers/logHelpers.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import { wss } from "../sockets/socketConfig.js";

const getAllDenuncias = async (req, res) => {
    const { clasificada } = req.params
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
            where: {
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
                        {
                            model: Modalidad,
                            include: [
                                { model: TipoDelito }
                            ]
                        }
                    ]
                },
                { model: Comisaria },
                { model: TipoDelito }
            ],
        });

        const ubicacionesAuxiliares = await UbicacionAuxiliar.findAll({
            where: {
                denunciaId: id
            }
        })
        denuncia.dataValues.ubicacionesAuxiliares = ubicacionesAuxiliares

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
    const { regional, interes, propiedad, año } = req.body;
    const id = req.body.denunciaSearch
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const offset = page * limit;
    try {
        let denuncias, total;
        const whereConditions = {
            isClassificated: 1
        };
        if (interes === 1) {
            whereConditions.interes = interes;
        }

        if (propiedad === 1) {
            whereConditions.especializacionId = propiedad;
        }

        if (año) {
            whereConditions.fechaDenuncia = {
                [Op.between]: [`${año}-01-01`, `${año}-12-31`]
            }
        }

        if (!id) {
            const includeModels = [
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
                { model: TipoDelito }
            ]

            if (regional) {
                includeModels.push({
                    model: Comisaria,
                    where: {
                        unidadRegionalId: regional
                    }
                });
            } else {
                includeModels.push({ model: Comisaria });
            }

            total = await Denuncia.count({
                where: whereConditions,
                include: regional ? [{ model: Comisaria, where: { unidadRegionalId: regional } }] : []
            });

            const denuncias = await Denuncia.findAll({
                include: includeModels,
                where: whereConditions,
                limit,
                offset
            });

            return res.status(200).json({
                denuncias,
                total,
                page,
                totalPages: Math.ceil(total / limit),
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
                limit,
                offset
            });

            total = await Denuncia.count({
                where: {
                    idDenuncia: {
                        [Op.like]: `%${id}%`
                    },
                    isClassificated: 1
                }
            });

            return res.status(200).json({
                denuncias,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllRegional = async (req, res) => {
    const { regional, interes, propiedad, comisaria } = req.body;
    // console.log("Regional: ", req.body.regional)
    // console.log("Interes: ", req.body.interes)
    // console.log("Propiedad: ", req.body.propiedad)
    try {
        const whereConditions = {
            isClassificated: {
                [Op.in]: [0, 2]
            }
        };
        if (interes === 1) {
            whereConditions.interes = interes;
        }

        if (propiedad === 1) {
            whereConditions.especializacionId = propiedad;
        }

        if (comisaria) {
            whereConditions.comisariaId = comisaria;
        }

        const includeModels = [
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
            { model: TipoDelito }
        ];

        if (regional) {
            includeModels.push({
                model: Comisaria,
                where: {
                    unidadRegionalId: regional
                }
            });
        } else {
            includeModels.push({ model: Comisaria });
        }

        const denuncias = await Denuncia.findAll({
            include: includeModels,
            where: whereConditions
        });

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
            let ubicacionAuxiliar;
            try {
                ubicacion = await Ubicacion.create({
                    latitud: denunciaData.latitud,
                    longitud: denunciaData.longitud,
                    domicilio: denunciaData.domicilio,
                    // domicilio_ia: denunciaData.domicilio_ia,
                    poligono: denunciaData.poligono,
                    localidadId: denunciaData.localidadId,
                    tipo_precision: denunciaData.tipo_precision,
                    estado: denunciaData.estado
                }, { transaccion });

                const denuncia = await Denuncia.create({
                    idDenuncia: denunciaData.idDenuncia,
                    fechaDenuncia: denunciaData.fechaDenuncia,
                    dniDenunciante: denunciaData.dniDenunciante,
                    interes: denunciaData.interes,
                    aprehendido: denunciaData.aprehendido,
                    //medida: denunciaData.medida,
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
                    isClassificated: denunciaData.isClassificated,
                    relato: denunciaData.relato,
                    cantidad_victimario: denunciaData.cantidad_victimario,
                }, transaccion);


                if ((denunciaData.idDenuncia).charAt(0) !== 'A') {
                    if (Array.isArray(denunciaData.ubicacionesAuxiliares) && denunciaData.ubicacionesAuxiliares.length > 0) {
                        for (const ubi of denunciaData.ubicacionesAuxiliares) {
                            ubicacionAuxiliar = await UbicacionAuxiliar.create({
                                latitudAuxiliar: ubi.latitudAuxiliar,
                                longitudAuxiliar: ubi.longitudAuxiliar,
                                tipo_precision: ubi.tipo_precision,
                                domicilioAuxiliar: ubi.domicilioAuxiliar,
                                localidadId: ubi.localidadId,
                                denunciaId: denunciaData.idDenuncia
                            }, { transaccion });
                        }
                    } else {
                        ubicacionAuxiliar = await UbicacionAuxiliar.create({
                            latitudAuxiliar: denunciaData.ubicacionesAuxiliares.latitudAuxiliar,
                            longitudAuxiliar: denunciaData.ubicacionesAuxiliares.longitudAuxiliar,
                            tipo_precision: denunciaData.ubicacionesAuxiliares.tipo_precision,
                            domicilioAuxiliar: denunciaData.ubicacionesAuxiliares.domicilioAuxiliar,
                            localidadId: denunciaData.ubicacionesAuxiliares.localidadId,
                            denunciaId: denunciaData.ubicacionesAuxiliares.idDenuncia
                        }, { transaccion });
                    }
                }

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
    const errores = [];
    const { denuncias } = req.body;

    console.log("Denuncias a actualizar: ", denuncias);
    let denunciasActualizadas = 0;
    let denunciasNoActualizadas = 0;
    const transaccion = await sequelize.transaction();

    try {
        for (const denunciaData of denuncias) {
            console.log("DenunciaData: ", denunciaData);
            let denuncia;
            try {
                denuncia = await Denuncia.findByPk(denunciaData.idDenuncia, { transaction: transaccion });

                if (!denuncia) {
                    throw new Error(`Denuncia con ID ${denunciaData.idDenuncia} no encontrada`);
                }

                const idUbicacion = denuncia.ubicacionId;
                console.log("idUbicacion: ", idUbicacion)

                if (!idUbicacion) {
                    throw new Error(`La denuncia con ID ${denunciaData.idDenuncia} no tiene una ubicación asociada`);
                }

                await denuncia.update({
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
                    submodalidadId: denunciaData.submodalidadId,
                    tipoDelitoId: denunciaData.tipoDelitoId,
                    isClassificated: denunciaData.isClassificated,
                    relato: denunciaData.relato
                }, { transaction: transaccion });

                await Ubicacion.update({
                    latitud: denunciaData.latitud,
                    longitud: denunciaData.longitud,
                    domicilio: denunciaData.domicilio,
                    poligono: denunciaData.poligono,
                    localidadId: denunciaData.localidadId,
                    estado: denunciaData.estado
                }, {
                    where: { idUbicacion: idUbicacion },
                    transaction: transaccion
                });

                await registrarLog('UPDATE', `DENUNCIA ${denuncia.idDenuncia} ACTUALIZADA`, req.userId);
                denunciasActualizadas += 1;
            } catch (error) {
                errores.push({
                    denuncia: denunciaData,
                    error: error.message
                });

                await registrarLog('ERROR', `Fallo al actualizar denuncia ${denunciaData.idDenuncia}: ${error.message}`, req.userId);
                denunciasNoActualizadas += 1;
            }
        }

        if (errores.length > 0) {
            await transaccion.rollback();
            console.log("Transacción revertida debido a errores en algunas actualizaciones.");
            res.status(400).json({
                message: "Transacción revertida: algunas denuncias fallaron al actualizarse",
                denunciasActualizadas,
                denunciasNoActualizadas,
                errores
            });
        } else {
            await transaccion.commit();
            res.status(200).json({
                message: "Lote de denuncias actualizado con éxito",
                denunciasActualizadas,
                denunciasNoActualizadas,
                errores
            });
        }
    } catch (error) {
        await transaccion.rollback();
        await registrarLog('ERROR', `Error inesperado durante la transacción: ${error.message}`, req.userId);
        res.status(500).json({
            message: "Error en la actualización del lote de denuncias",
            denunciasActualizadas,
            denunciasNoActualizadas: denuncias.length - denunciasActualizadas,
            error: error.message
        });
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
                isClassificated: {
                    [Op.in]: [0, 2]
                }
            }
        });
        res.status(200).json({ amount })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDenunciaReciente = async (req, res) => {
    try {
        const denunciaReciente = await Denuncia.findOne({
            attributes: ['fechaDenuncia'],
            order: [['fechaDenuncia', 'DESC']],
            where: {
                isClassificated: 1,
            },
            include: [
                {
                    model: Comisaria,
                    include: [
                        { model: UnidadRegional }
                    ]
                }
            ]
        })
        res.status(200).json(denunciaReciente)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTotalDenuncias = async (req, res) => {
    const { desde, hasta, regional } = req.query;

    console.log("Regional:", regional);

    try {
        const totalDenunciasClasificadas = await Denuncia.count({
            where: {
                isClassificated: 1,
                fechaDenuncia: {
                    [Op.gte]: desde,
                    [Op.lte]: hasta
                }
            },
            include: [
                {
                    model: Comisaria,
                    required: true,
                    include: regional && regional !== "undefined" ? [
                        {
                            model: UnidadRegional,
                            where: { idUnidadRegional: regional }
                        }
                    ] : [
                        {
                            model: UnidadRegional
                        }
                    ]
                }
            ],
            logging: console.log
        });

        res.status(200).json(totalDenunciasClasificadas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalInteres = async (req, res) => {
    const { desde, hasta, regional } = req.query
    try {
        const totalDenunciasInteres = await Denuncia.count({
            where: {
                isClassificated: 1,
                interes: 1,
                fechaDenuncia: {
                    [Op.gte]: desde,
                    [Op.lte]: hasta
                }
            },
            include: [
                {
                    model: Comisaria,
                    required: true,
                    include: regional && regional !== "undefined" ? [
                        {
                            model: UnidadRegional,
                            where: { idUnidadRegional: regional }
                        }
                    ] : [
                        {
                            model: UnidadRegional
                        }
                    ]
                }
            ],
        })
        res.status(200).json(totalDenunciasInteres)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getInteresTotalGrafica = async (req, res) => {
    const { desde, hasta, regional } = req.query;
    try {
        const interestotal = await Denuncia.findAll({
            attributes: [
                [fn('YEAR', col('fechaDenuncia')), 'anio'],
                [fn('MONTH', col('fechaDenuncia')), 'mes'],
                [fn('COUNT', col('*')), 'cantidad_total'],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN interes = 1 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_interes',
                ],
            ],
            include: [
                {
                    model: Comisaria,
                    as: 'Comisarium',
                    attributes: [],
                    required: true,
                    include: regional && regional !== "undefined" ? [
                        {
                            model: UnidadRegional,
                            as: 'unidadRegional',
                            attributes: [],
                            where: { idUnidadRegional: regional }
                        }
                    ] : [
                        {
                            model: UnidadRegional,
                            as: 'unidadRegional',
                            attributes: [],
                        }
                    ]
                },
            ],
            where: {
                isClassificated: 1,
                fechaDenuncia: {
                    [Op.gte]: desde,
                    [Op.lte]: hasta,
                },
            },
            group: [
                fn('YEAR', col('fechaDenuncia')),
                fn('MONTH', col('fechaDenuncia')),
            ],
            order: [
                [fn('YEAR', col('fechaDenuncia')), 'ASC'],
                [fn('MONTH', col('fechaDenuncia')), 'ASC'],
            ],
        });

        const data = interestotal.map(item => ({
            anio: item.get('anio'),
            mes: item.get('mes'),
            cantidad_total: item.get('cantidad_total'),
            cantidad_interes: item.get('cantidad_interes'),
            nombre_regional: item.get('nombre_regional') || 'Sin regional',
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error("Error en getInteresTotalGrafica:", error);
        res.status(500).json({ message: error.message });
    }
};

const getDelitoGrafica = async (req, res) => {
    const { desde, hasta, regional } = req.query
    try {
        const delito = await Denuncia.findAll({
            attributes: [
                [fn('YEAR', col('fechaDenuncia')), 'anio'],
                [fn('MONTH', col('fechaDenuncia')), 'mes'],
                [fn('COUNT', col('*')), 'cantidad_total'],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 52 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_robo',
                ],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 51 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_arma',
                ],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 36 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_hurto',
                ],
            ],
            include: [
                {
                    model: Comisaria,
                    as: 'Comisarium',
                    attributes: [],
                    required: true,
                    include: regional && regional !== "undefined" ? [
                        {
                            model: UnidadRegional,
                            as: 'unidadRegional',
                            attributes: [],
                            where: { idUnidadRegional: regional }
                        }
                    ] : [
                        {
                            model: UnidadRegional,
                            as: 'unidadRegional',
                            attributes: [],
                        }
                    ]
                },
            ],
            where: {
                isClassificated: 1,
                interes: 1,
                fechaDenuncia: {
                    [Op.gte]: desde,
                    [Op.lte]: hasta
                }
            },
            group: [fn('YEAR', col('fechaDenuncia')), fn('MONTH', col('fechaDenuncia'))],
            order: [
                [fn('YEAR', col('fechaDenuncia')), 'ASC'],
                [fn('MONTH', col('fechaDenuncia')), 'ASC'],
            ],
        })

        const data = delito.map(item => ({
            anio: item.get('anio'),
            mes: item.get('mes'),
            cantidad_total: item.get('cantidad_total'),
            cantidad_robo: item.get('cantidad_robo'),
            cantidad_arma: item.get('cantidad_arma'),
            cantidad_hurto: item.get('cantidad_hurto'),
        }));

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTablaInteres = async (req, res) => {
    const { mes, anio } = req.query
    try {
        const tablaInteres = await Denuncia.findAll({
            attributes: [
                [fn('YEAR', col('fechaDenuncia')), 'anio'],
                [fn('MONTH', col('fechaDenuncia')), 'mes'],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 52 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_robo',
                ],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 51 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_arma',
                ],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 36 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_hurto',
                ],
            ],
            where: {
                [Op.and]: [
                    sequelize.where(fn('MONTH', col('fechaDenuncia')), mes),
                    { interes: 1 },
                    { isClassificated: 1 },
                    sequelize.where(fn('YEAR', col('fechaDenuncia')), {
                        [Op.in]: [anio, anio - 1]
                    })
                ]
            },
            group: [fn('YEAR', col('fechaDenuncia')), fn('MONTH', col('fechaDenuncia'))],
            order: [
                [fn('YEAR', col('fechaDenuncia')), 'ASC'],
                [fn('MONTH', col('fechaDenuncia')), 'ASC'],
            ],
        })
        res.status(200).json(tablaInteres)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getTablaMensual = async (req, res) => {
    const { mes, anio } = req.query
    try {
        const tablaInteres = await Denuncia.findAll({
            attributes: [
                [fn('YEAR', col('fechaDenuncia')), 'anio'],
                [fn('MONTH', col('fechaDenuncia')), 'mes'],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 52 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_robo',
                ],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 51 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_arma',
                ],
                [
                    fn(
                        'SUM',
                        literal("CASE WHEN tipoDelitoId = 36 THEN 1 ELSE 0 END")
                    ),
                    'cantidad_hurto',
                ],
            ],
            where: {
                [Op.and]: [
                    sequelize.where(fn('YEAR', col('fechaDenuncia')), anio),
                    { interes: 1 },
                    { isClassificated: 1 },
                    sequelize.where(fn('MONTH', col('fechaDenuncia')), {
                        [Op.in]: [mes, mes - 1]
                    })
                ]
            },
            group: [fn('YEAR', col('fechaDenuncia')), fn('MONTH', col('fechaDenuncia'))],
            order: [
                [fn('YEAR', col('fechaDenuncia')), 'ASC'],
                [fn('MONTH', col('fechaDenuncia')), 'ASC'],
            ],
        })
        res.status(200).json(tablaInteres)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAño = async (req, res) => {
    try {
        const years = await Denuncia.findAll({
            attributes: [
                [Sequelize.fn("YEAR", Sequelize.col("fechaDenuncia")), "year"]
            ],
            group: [Sequelize.fn("YEAR", Sequelize.col("fechaDenuncia"))],
            order: [[Sequelize.fn("YEAR", Sequelize.col("fechaDenuncia")), "ASC"]],
            raw: true,
        });

        res.status(200).json(years);
    } catch (error) {
        console.error("Error obteniendo años:", error);
        res.status(500).json({ error: "Error obteniendo años" });
    }
}

export { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllLike, getAllRegional, denunciaTrabajando, getDenunciaReciente, getTotalDenuncias, getTotalInteres, getInteresTotalGrafica, getDelitoGrafica, getTablaInteres, getTablaMensual, getAño };
