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
import { Op, fn, col, literal, Sequelize, where } from "sequelize";
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
    console.log("Denuncia desde controlador: ", req.params.id)
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

const getDenunciaByIdVista = async (req, res) => {
    const { denuncia } = req.body;
    const denunciaDecodedId = decodeURIComponent(denuncia);
    console.log(req.body);

    try {
        const query = `SELECT * FROM denuncias_completas_v9 WHERE NRO_DENUNCIA = "${denunciaDecodedId}"`;
        const denuncia = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
        });

        res.status(200).json(denuncia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEstadisticasClasificacion = async (req, res) => {
    const { fechaInicio, fechaFin } = req.body

    let whereClause = []
    let replacements = {}

    if (fechaInicio && fechaFin) {
        whereClause.push(`den.fechaDelito >= :fechaInicio AND den.fechaDelito <= :fechaFin`);
        replacements.fechaInicio = fechaInicio;
        replacements.fechaFin = fechaFin;
    }

    const where = whereClause.length > 0 ? `AND ${whereClause.join(' AND ')}` : '';

    try {
        const querySubmodalidad = `SELECT
        SUM(CASE WHEN JSON_UNQUOTE(ia.resultado_modus_operandi) = submo.descripcion THEN 1 ELSE 0 END) AS coinciden,
        SUM(CASE WHEN JSON_UNQUOTE(ia.resultado_modus_operandi) != submo.descripcion THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        JOIN submodalidad AS submo ON den.submodalidadId = submo.idSubmodalidad
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const submodalidad = await sequelize.query(querySubmodalidad, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const queryAprehendido = `SELECT
        SUM(CASE 
            WHEN 
            (JSON_UNQUOTE(JSON_EXTRACT(resultado_accion_posterior, '$.aprehendimiento_policial')) = 'true' AND den.aprehendido = 1)
            OR
            (JSON_UNQUOTE(JSON_EXTRACT(resultado_accion_posterior, '$.aprehendimiento_policial')) = 'false' AND den.aprehendido = 0)
            THEN 1 ELSE 0
        END) AS coinciden,
        SUM(CASE 
            WHEN 
            (JSON_UNQUOTE(JSON_EXTRACT(resultado_accion_posterior, '$.aprehendimiento_policial')) = 'true' AND den.aprehendido = 0)
            OR
            (JSON_UNQUOTE(JSON_EXTRACT(resultado_accion_posterior, '$.aprehendimiento_policial')) = 'false' AND den.aprehendido = 1)
            THEN 1 ELSE 0
        END) AS cambiaron
        FROM denuncia AS den
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const aprehendido = await sequelize.query(queryAprehendido, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const queryMovilidad = `SELECT
        SUM(CASE 
            WHEN LOWER(JSON_UNQUOTE(JSON_EXTRACT(resultado_victimario, '$.movilidad'))) = 
                    CASE LOWER(mov.descripcion) WHEN 'sd' THEN 'desconocido' ELSE LOWER(mov.descripcion) END 
            THEN 1 ELSE 0 
        END) AS coinciden,
        SUM(CASE 
            WHEN LOWER(JSON_UNQUOTE(JSON_EXTRACT(resultado_victimario, '$.movilidad'))) != 
                    CASE LOWER(mov.descripcion) WHEN 'sd' THEN 'desconocido' ELSE LOWER(mov.descripcion) END 
            THEN 1 ELSE 0 
        END) AS cambiaron
        FROM denuncia AS den
        JOIN movilidad AS mov ON den.movilidadId = mov.idMovilidad
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const movilidad = await sequelize.query(queryMovilidad, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const queryAutor = `SELECT
        SUM(CASE 
            WHEN lower(JSON_UNQUOTE(JSON_EXTRACT(resultado_victimario, '$.autor'))) =
                CASE lower(aut.descripcion)
                WHEN "personal_policial" THEN "personal policial"
                WHEN "SD" THEN "desconocido"
                ELSE lower(aut.descripcion)
                END
            THEN 1 ELSE 0 END) AS coinciden,
    
        SUM(CASE 
            WHEN lower(JSON_UNQUOTE(JSON_EXTRACT(resultado_victimario, '$.autor'))) !=
                CASE lower(aut.descripcion)
                WHEN "personal_policial" THEN "personal policial"
                WHEN "SD" THEN "desconocido"
                ELSE lower(aut.descripcion)
                END
            THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        INNER JOIN autor AS aut ON den.autorId = aut.idAutor
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const autor = await sequelize.query(queryAutor, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const querySeguro = `SELECT
        SUM(CASE 
            WHEN ia.resultado_para_seguro = den.seguro
            THEN 1 ELSE 0 END) AS coinciden,

        SUM(CASE 
            WHEN ia.resultado_para_seguro != den.seguro
            THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const seguro = await sequelize.query(querySeguro, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const queryArma = `SELECT
        SUM(CASE 
            WHEN LOWER(JSON_UNQUOTE(JSON_EXTRACT(resultado_victimario, '$.arma_utilizada'))) =
                CASE LOWER(TRIM(arma.descripcion)) 
                WHEN "Arma Blanca" THEN "blanca"
                WHEN "Arma de fuego" THEN "de fuego"
                ELSE LOWER(TRIM(arma.descripcion))
                END
            THEN 1 ELSE 0 END) AS coinciden,
    
        SUM(CASE 
            WHEN LOWER(JSON_UNQUOTE(JSON_EXTRACT(resultado_victimario, '$.arma_utilizada'))) !=
                CASE LOWER(TRIM(arma.descripcion)) 
                WHEN "Arma Blanca" THEN "blanca"
                WHEN "Arma de fuego" THEN "de fuego"
                ELSE LOWER(TRIM(arma.descripcion))
                END
            THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        INNER JOIN tipoArma AS arma ON den.tipoArmaId = arma.idtipoArma
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const arma = await sequelize.query(queryArma, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const queryRiesgo = `SELECT
        SUM(CASE 
            WHEN 
            (JSON_UNQUOTE(JSON_EXTRACT(resultado_victima, '$.riesgo')) = 'true' AND den.victima = 1)
            OR (JSON_UNQUOTE(JSON_EXTRACT(resultado_victima, '$.riesgo')) = 'false' AND den.victima = 0)
            THEN 1 ELSE 0 END) AS coinciden,

        SUM(CASE 
            WHEN 
            (JSON_UNQUOTE(JSON_EXTRACT(resultado_victima, '$.riesgo')) = 'true' AND den.victima = 0)
            OR (JSON_UNQUOTE(JSON_EXTRACT(resultado_victima, '$.riesgo')) = 'false' AND den.victima = 1)
            THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const riesgo = await sequelize.query(queryRiesgo, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const queryLugar = `SELECT
        SUM(CASE 
            WHEN JSON_UNQUOTE(JSON_EXTRACT(resultado_lugar, '$.lugar_del_hecho')) = den.lugar_del_hecho
            THEN 1 ELSE 0 END) AS coinciden,
        SUM(CASE 
            WHEN JSON_UNQUOTE(JSON_EXTRACT(resultado_lugar, '$.lugar_del_hecho')) != den.lugar_del_hecho
            THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where};`

        const lugar = await sequelize.query(queryLugar, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        res.status(200).json({ submodalidad, aprehendido, movilidad, autor, arma, seguro, riesgo, lugar });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEstadisticasSubmodalidad = async (req, res) => {
    const { fechaInicio, fechaFin } = req.body

    let whereClause = []
    let replacements = {}

    if (fechaInicio && fechaFin) {
        whereClause.push(`den.fechaDelito >= :fechaInicio AND den.fechaDelito <= :fechaFin`);
        replacements.fechaInicio = fechaInicio;
        replacements.fechaFin = fechaFin;
    }

    const where = whereClause.length > 0 ? `AND ${whereClause.join(' AND ')}` : '';

    try {
        const queryConteo = `SELECT
        ia.resultado_modus_operandi AS modalidad_ia,
        SUM(CASE WHEN ia.resultado_modus_operandi = submo.descripcion THEN 1 ELSE 0 END) AS coinciden,
        SUM(CASE WHEN ia.resultado_modus_operandi <> submo.descripcion THEN 1 ELSE 0 END) AS cambiaron
        FROM denuncia AS den
        INNER JOIN submodalidad AS submo ON den.submodalidadId = submo.idSubmodalidad
        INNER JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where}
        GROUP BY ia.resultado_modus_operandi;`

        const conteo = await sequelize.query(queryConteo, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        res.status(200).json({ conteo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEstadisticasSankey = async (req, res) => {
    const { fechaInicio, fechaFin } = req.body

    let whereClause = []
    let replacements = {}

    if (fechaInicio && fechaFin) {
        whereClause.push(`den.fechaDelito >= :fechaInicio AND den.fechaDelito <= :fechaFin`);
        replacements.fechaInicio = fechaInicio;
        replacements.fechaFin = fechaFin;
    }

    const where = whereClause.length > 0 ? `AND ${whereClause.join(' AND ')}` : '';

    try {
        const querySankey = `SELECT 
        ia.resultado_modus_operandi AS 'from',
        submo.descripcion AS 'to',
        COUNT(*) AS 'flow'
        FROM denuncia AS den
        INNER JOIN submodalidad AS submo ON den.submodalidadId = submo.idSubmodalidad
        INNER JOIN objeto_ia AS ia ON den.idDenuncia = ia.nro_denuncia
        WHERE den.interes = 1 AND den.isClassificated = 1 ${where}
        GROUP BY ia.resultado_modus_operandi, submo.descripcion;`

        const sankey = await sequelize.query(querySankey, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        res.status(200).json({ sankey });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllRegional = async (req, res) => {
    const { regional, interes, propiedad, comisaria, mesDenuncia, IA, observada } = req.body;

    try {
        const whereConditions = {}
        // const whereConditions = {
        //     isClassificated: {
        //         [Op.in]: [0, 2, 3]
        //     }
        // };
        const values = []

        if(IA === 1){
            values.push(2)
        }

        if(observada === 1){
            values.push(3)
        }

        if(values.length > 0){
            whereConditions.isClassificated = {[Op.in]: values}
        }

        if (interes === 1) {
            whereConditions.interes = interes;
        }

        if (propiedad === 1) {
            whereConditions.especializacionId = propiedad;
        }

        if (comisaria) {
            whereConditions.comisariaId = comisaria;
        }

        if (mesDenuncia) {
            const [year, month] = mesDenuncia.split("-").map(Number);
            const startDate = new Date(year, month - 1, 1); // primer día del mes
            const endDate = new Date(year, month, 0, 23, 59, 59); // último día del mes

            whereConditions.fechaDenuncia = {
                [Op.between]: [startDate, endDate]
            };
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
                },
                include: [
                    { model: UnidadRegional, where: { idUnidadRegional: regional } }
                ]
            });
        } else {
            includeModels.push({
                model: Comisaria,
                include: [
                    { model: UnidadRegional, as: 'unidadRegional' }
                ]
            });
        }

        const denuncias = await Denuncia.findAll({
            include: includeModels,
            where: whereConditions
        });

        const comisariasUnicas = [];
        const regionalesUnicas = [];

        const comisariaIds = new Set();
        const regionalIds = new Set();

        for (const denuncia of denuncias) {
            const comisaria = denuncia.Comisarium;
            if (comisaria && !comisariaIds.has(comisaria.idComisaria)) {
                comisariaIds.add(comisaria.idComisaria);
                comisariasUnicas.push(comisaria);
            }

            const regional = comisaria?.unidadRegional;
            if (regional && !regionalIds.has(regional.idUnidadRegional)) {
                regionalIds.add(regional.idUnidadRegional);
                regionalesUnicas.push(regional);
            }
        }

        res.status(200).json({
            denuncias,
            comisarias: comisariasUnicas,
            regionales: regionalesUnicas
        });
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

        await registrarLog('UPDATE', `DENUNCIA ${req.body.denunciaid} ACTUALIZADA`, req.user?.id);

        res.status(200).json(denuncia)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createDenuncia = async (req, res) => {
    const { denuncias } = req.body;
    const errores = [];
    let denunciasCargadas = 0;
    let denunciasNoCargadas = 0;

    const transaccion = await sequelize.transaction();

    try {
        for (const denunciaData of denuncias) {
            try {
                // Crear ubicación principal
                if (denunciaData.relato && denunciaData.relato.length > 10000) {
                    denunciaData.relato = denunciaData.relato.slice(0, 10000);
                }
                if (denunciaData.domicilio_victima && denunciaData.domicilio_victima.length > 100) {
                    denunciaData.domicilio_victima = denunciaData.relato.slice(0, 100)
                }

                const ubicacion = await Ubicacion.create({
                    latitud: denunciaData.latitud,
                    longitud: denunciaData.longitud,
                    domicilio: denunciaData.domicilio,
                    domicilio_ia: denunciaData.domicilio_ia,
                    poligono: denunciaData.poligono,
                    localidadId: denunciaData.localidadId,
                    tipo_precision: denunciaData.tipo_precision,
                    estado: denunciaData.estado
                }, { transaction: transaccion });

                // Crear denuncia
                const denuncia = await Denuncia.create({
                    idDenuncia: denunciaData.idDenuncia,
                    fechaDenuncia: denunciaData.fechaDenuncia,
                    dniDenunciante: denunciaData.dniDenunciante,
                    interes: denunciaData.interes,
                    aprehendido: denunciaData.aprehendido,
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
                    lugar_del_hecho: denunciaData.lugar_del_hecho,
                    victimario: denunciaData.victimario,
                    domicilio_victima: denunciaData.domicilio_victima,
                    localidad_victima: denunciaData.localidad_victima
                }, { transaction: transaccion });

                // Si corresponde, crear ubicaciones auxiliares
                if (denunciaData.idDenuncia.charAt(0) !== 'A' && Array.isArray(denunciaData.ubicacionesAuxiliares) &&
                    denunciaData.ubicacionesAuxiliares.length > 0) {
                    const ubicacionesAux = Array.isArray(denunciaData.ubicacionesAuxiliares)
                        ? denunciaData.ubicacionesAuxiliares
                        : [denunciaData.ubicacionesAuxiliares];

                    for (const ubi of ubicacionesAux) {
                        await UbicacionAuxiliar.create({
                            latitudAuxiliar: ubi.latitudAuxiliar,
                            longitudAuxiliar: ubi.longitudAuxiliar,
                            tipo_precision: ubi.tipo_precision,
                            domicilioAuxiliar: ubi.domicilioAuxiliar,
                            localidadId: ubi.localidadId,
                            denunciaId: denunciaData.idDenuncia
                        }, { transaction: transaccion });
                    }
                }

                await registrarLog('CREATE', `DENUNCIA ${denuncia.idDenuncia} CREADA`, req.user?.id);
                denunciasCargadas++;

            } catch (error) {
                console.error(`Error al procesar denuncia ${denunciaData.idDenuncia}:`, error.message);

                errores.push({
                    denuncia: denunciaData.idDenuncia,
                    error: error.message
                });

                await registrarLog('ERROR', `Error al crear denuncia ${denunciaData.idDenuncia}: ${error.message}`, req.user?.id);
                denunciasNoCargadas++;
            }
        }

        if (errores.length > 0) {
            await transaccion.rollback();
            console.log("Transacción revertida. No se cargaron todas las denuncias.");
            return res.status(400).json({
                message: "Transacción revertida: hubo errores en algunas denuncias.",
                denunciasCargadas,
                denunciasNoCargadas,
                errores
            });
        }

        await transaccion.commit();
        res.status(201).json({
            message: "Todas las denuncias cargadas con éxito.",
            denunciasCargadas,
            denunciasNoCargadas,
            errores
        });

    } catch (error) {
        console.error("Error inesperado:", error.message);
        await transaccion.rollback();
        await registrarLog('ERROR', `Error general al cargar denuncias: ${error.message}`, req.user?.id);

        res.status(500).json({
            message: "Error inesperado al cargar denuncias.",
            denunciasCargadas,
            denunciasNoCargadas: denuncias.length - denunciasCargadas,
            error: error.message
        });
    }
};

const updateDenuncia = async (req, res) => {
    const { denuncias } = req.body;
    const errores = [];

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
                    dniDenunciante: denunciaData.dniDenunciante,
                    interes: denunciaData.interes,
                    aprehendido: denunciaData.aprehendido,
                    seguro: denunciaData.seguro,
                    elementoSustraido: denunciaData.elementoSustraido,
                    tipoArmaId: denunciaData.tipoArmaId,
                    movilidadId: denunciaData.movilidadId,
                    autorId: denunciaData.autorId,
                    victima: denunciaData.victima,
                    especializacionId: denunciaData.especializacionId,
                    submodalidadId: denunciaData.submodalidadId,
                    isClassificated: denunciaData.isClassificated,
                    cantidad_victimario: denunciaData.cantidad_victimario,
                    lugar_del_hecho: denunciaData.lugar_del_hecho,
                    victimario: denunciaData.victimario,
                    domicilio_victima: denunciaData.domicilio_victima,
                    localidad_victima: denunciaData.localidad_victima,
                    comisariaId: denunciaData.comisariaId,
                    detalleObservacion: denunciaData.detalleObservacion,
                }, { transaction: transaccion });

                await Ubicacion.update({
                    latitud: denunciaData.latitud,
                    longitud: denunciaData.longitud,
                    domicilio: denunciaData.domicilio,
                    domicilio_ia: denunciaData.domicilio_ia,
                    poligono: denunciaData.poligono,
                    localidadId: denunciaData.localidadId,
                    tipo_precision: denunciaData.tipo_precision,
                    estado: denunciaData.estado
                }, {
                    where: { idUbicacion: idUbicacion },
                    transaction: transaccion
                });

                console.log("El deni es: " , req.user?.id)
                await registrarLog('UPDATE', `DENUNCIA ${denuncia.idDenuncia} ACTUALIZADA`, req.user?.id);
                denunciasActualizadas += 1;
            } catch (error) {
                errores.push({
                    denuncia: denunciaData,
                    error: error.message
                });

                await registrarLog('ERROR', `Fallo al actualizar denuncia ${denunciaData.idDenuncia}: ${error.message}`, req.user?.id);
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
        await registrarLog('ERROR', `Error inesperado durante la transacción: ${error.message}`, req.user?.id);
        res.status(500).json({
            message: "Error en la actualización del lote de denuncias",
            denunciasActualizadas,
            denunciasNoActualizadas: denuncias.length - denunciasActualizadas,
            error: error.message
        });
    }
}

const updateClasificacion = async (req, res) => {
    const { idDenuncia, detalle } = req.body;
    console.log("Denuncia y detalle: ", idDenuncia, detalle)
    const errores = [];

    let denunciasActualizadas = 0;
    let denunciasNoActualizadas = 0;

    const transaccion = await sequelize.transaction();
    let denuncia;
    try {
        denuncia = await Denuncia.findByPk(idDenuncia, { transaction: transaccion });

        if (!denuncia) {
            throw new Error(`Denuncia con ID ${idDenuncia} no encontrada`);
        }

        await denuncia.update({
            isClassificated: 3,
            detalleObservacion: detalle
        }, { transaction: transaccion });

        await registrarLog('UPDATE', `DENUNCIA ${idDenuncia} ACTUALIZADA`, req.user?.id);
        denunciasActualizadas += 1;
    } catch (error) {
        errores.push({
            denuncia: idDenuncia,
            error: error.message
        });

        await registrarLog('ERROR', `Fallo al actualizar denuncia ${idDenuncia}: ${error.message}`, req.user?.id);
        denunciasNoActualizadas += 1;
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
}

const deleteDenuncia = async (req, res) => {
    const { id } = req.params;
    try {
        const denuncia = await Denuncia.destroy({
            where: {
                idDenuncia: id
            }
        });

        await registrarLog('DELETE', `DENUNCIA ${id} ELIMINADA`, req.user?.id);

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
                    [Op.in]: [2],
                },
                interes: 1,
                especializacionId: 1
            }
        });

        const amountObservadas = await Denuncia.count({
            where: {
                isClassificated: {
                    [Op.in]: [3],
                }
            }
        });

        res.status(200).json({ amount, amountObservadas })
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

export { updateClasificacion, getAllDenuncias, getDenunciaById, getDenunciaByIdVista, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllRegional, denunciaTrabajando, getDenunciaReciente, getTablaInteres, getTablaMensual, getAño, getEstadisticasClasificacion, getEstadisticasSankey, getEstadisticasSubmodalidad };
