import Usuario from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "../config/db.js";
import { Op, fn, col, literal, Sequelize, or } from "sequelize";
import { registrarLog } from "../helpers/logHelpers.js";

dotenv.config();

function ordenarPorFecha(obj) {
    const mesesOrden = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };

    const entries = Object.entries(obj);

    entries.sort((a, b) => {
        const [mesA, anioA] = a[0].split(" ");
        const [mesB, anioB] = b[0].split(" ");
        const dateA = new Date(+anioA, mesesOrden[mesA]);
        const dateB = new Date(+anioB, mesesOrden[mesB]);
        return dateA - dateB;
    });

    return Object.fromEntries(entries);
}

const getRanking = async (req, res) => {
    const { fechaDesde, fechaHasta } = req.query;

    try {
        let baseQuery = `
            SELECT log.dniId, COUNT(DISTINCT log.descripcion) AS cantidad_clasificadas
            FROM log
            WHERE accion = 'UPDATE'
              AND log.dniId <> 38243415
        `;

        let replacements = {};

        if (fechaDesde && fechaHasta) {
            baseQuery += ` AND fecha >= :fechaDesde AND fecha <= :fechaHasta`;
            replacements.fechaDesde = fechaDesde;
            replacements.fechaHasta = fechaHasta;
        }

        baseQuery += `
            GROUP BY log.dniId
            ORDER BY cantidad_clasificadas DESC
        `;

        const ranking = await sequelize.query(baseQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        console.log("Ranking: ", ranking)

        const usuariosPromises = ranking.map(async r => {
            const response = await fetch(`http://127.0.0.1:3008/auth/usuario/dni/${r.dniId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.INTERNAL_API_TOKEN}`
                },
            });

            if (!response.ok) {
                return { nombre: "Desconocido", dni: r.dniId }; // fallback si no existe
            }

            return response.json();
        })

        const usuarios = await Promise.all(usuariosPromises)

        const rankingFinal = ranking.map((r, i) => ({
            dniId: r.dniId,
            cantidad_clasificadas: r.cantidad_clasificadas,
            usuario: usuarios[i]
        }));

        res.status(200).json(rankingFinal);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getRankingObservada = async (req, res) => {
    const { fechaDesde, fechaHasta } = req.query;

    try {
        let baseQuery = `
            SELECT log.dniId, COUNT(DISTINCT log.descripcion) AS cantidad_clasificadas
            FROM log
            WHERE accion = 'OBSERVAR'
        `;

        let replacements = {};

        if (fechaDesde && fechaHasta) {
            baseQuery += ` AND fecha >= :fechaDesde AND fecha <= :fechaHasta`;
            replacements.fechaDesde = fechaDesde;
            replacements.fechaHasta = fechaHasta;
        }

        baseQuery += `
            GROUP BY log.dniId
            ORDER BY cantidad_clasificadas DESC
        `;

        const ranking = await sequelize.query(baseQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        console.log("Ranking: ", ranking)

        const usuariosPromises = ranking.map(async r => {
            const response = await fetch(`http://127.0.0.1:3008/auth/usuario/dni/${r.dniId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.INTERNAL_API_TOKEN}`
                },
            });

            if (!response.ok) {
                return { nombre: "Desconocido", dni: r.dniId }; // fallback si no existe
            }

            return response.json();
        })

        const usuarios = await Promise.all(usuariosPromises)

        const rankingFinal = ranking.map((r, i) => ({
            dniId: r.dniId,
            cantidad_clasificadas: r.cantidad_clasificadas,
            usuario: usuarios[i]
        }));

        res.status(200).json(rankingFinal);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getRankingDiario = async (req, res) => {
    const { fechaDesde, fechaHasta } = req.query;

    try {
        let baseQuery = `
            SELECT log.dniId, COUNT(DISTINCT log.descripcion) AS cantidad_clasificadas
            FROM log
            WHERE accion = 'UPDATE'
        `;

        let replacements = {};

        if (fechaDesde && fechaHasta) {
            baseQuery += ` AND fecha >= :fechaDesde AND fecha <= :fechaHasta`;
            replacements.fechaDesde = fechaDesde;
            replacements.fechaHasta = fechaHasta;
        }

        baseQuery += `
            GROUP BY log.dniId
            ORDER BY cantidad_clasificadas DESC
        `;

        const ranking = await sequelize.query(baseQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        const usuariosPromises = ranking.map(async r => {
            const response = await fetch(`http://127.0.0.1:3008/auth/usuario/dni/${r.dniId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.INTERNAL_API_TOKEN}`
                },
            });

            if (!response.ok) {
                return { nombre: "Desconocido", dni: r.dniId }; // fallback si no existe
            }

            return response.json();
        })

        const usuarios = await Promise.all(usuariosPromises)

        const rankingFinal = ranking.map((r, i) => ({
            dniId: r.dniId,
            cantidad_clasificadas: r.cantidad_clasificadas,
            usuario: usuarios[i]
        }));

        res.status(200).json(rankingFinal);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error.message });
    }
};


const getVistaFiltros = async (req, res) => {
    const {
        fechaInicio, fechaFin, delito, submodalidad, interes, arma,
        especialidad, riesgo, seguro, lugar_del_hecho, comisaria
    } = req.body;

    let whereClause = [];
    let replacements = {};

    whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    if (fechaInicio && fechaFin) {
        whereClause.push(`FECHA_HECHO BETWEEN :fechaInicio AND :fechaFin`);
        replacements.fechaInicio = fechaInicio;
        replacements.fechaFin = fechaFin;
    }

    if (delito && delito.trim() !== '') {
        whereClause.push(`DELITO COLLATE utf8mb4_unicode_ci = :delito`);
        replacements.delito = delito;
    }

    if (submodalidad && submodalidad.trim() !== '') {
        whereClause.push(`SUBMODALIDAD COLLATE utf8mb4_unicode_ci = :submodalidad`);
        replacements.submodalidad = submodalidad;
    }

    if (arma && arma.trim() !== '') {
        whereClause.push(`\`ARMA UTILIZADA\` COLLATE utf8mb4_unicode_ci = :arma`);
        replacements.arma = arma;
    }

    if (interes !== undefined && interes !== null && String(interes).trim() !== '') {
        whereClause.push(`INTERES COLLATE utf8mb4_unicode_ci = :interes`);
        replacements.interes = String(interes).trim();
    }

    if (especialidad && especialidad.trim() !== '') {
        whereClause.push(`ESPECIALIZACION COLLATE utf8mb4_unicode_ci = :especializacion`);
        replacements.especializacion = especialidad;
    }

    if (seguro && seguro.trim() !== '') {
        whereClause.push(`\`PARA SEGURO\` COLLATE utf8mb4_unicode_ci = :seguro`);
        replacements.seguro = seguro;
    }

    if (riesgo && riesgo.trim() !== '') {
        whereClause.push(`VICTIMA COLLATE utf8mb4_unicode_ci = :riesgo`);
        replacements.riesgo = riesgo;
    }

    if (lugar_del_hecho && String(lugar_del_hecho).trim() !== '') {
        whereClause.push(`Lugar_del_Hecho COLLATE utf8mb4_unicode_ci = :lugar_del_hecho`);
        replacements.lugar_del_hecho = String(lugar_del_hecho).trim();
    }

    if (comisaria && comisaria.trim() !== '') {
        whereClause.push(`COMISARIA COLLATE utf8mb4_unicode_ci = :comisaria`);
        replacements.comisaria = comisaria;
    }

    const whereSql = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        // Definir los campos para los que queremos obtener valores distintos
        const filterFields = [
            { dbColumn: 'DELITO', resultKey: 'delitos' },
            { dbColumn: 'SUBMODALIDAD', resultKey: 'submodalidades' },
            { dbColumn: '`ARMA UTILIZADA`', resultKey: 'armas', cleanKey: 'ARMA UTILIZADA' },
            { dbColumn: 'ESPECIALIZACION', resultKey: 'especializaciones' },
            { dbColumn: '`PARA SEGURO`', resultKey: 'seguros', cleanKey: 'PARA SEGURO' },
            { dbColumn: 'VICTIMA', resultKey: 'riesgos' },
            { dbColumn: 'INTERES', resultKey: 'intereses' },
            { dbColumn: 'Lugar_del_Hecho', resultKey: 'lugares' },
            { dbColumn: 'COMISARIA', resultKey: 'comisarias' },
        ];

        const promises = filterFields.map(field => {
            let distinctWhereSql = whereSql;
            const notEmptyCondition = `${field.dbColumn} COLLATE utf8mb4_unicode_ci != ''`;

            if (distinctWhereSql) {
                distinctWhereSql += ` AND ${field.dbColumn} IS NOT NULL AND ${notEmptyCondition}`;
            } else {
                distinctWhereSql = `WHERE ${field.dbColumn} IS NOT NULL AND ${notEmptyCondition}`;
            }

            const query = `
                SELECT DISTINCT ${field.dbColumn}
                FROM denuncias_completas_v9
                ${distinctWhereSql}
                ORDER BY ${field.dbColumn};
            `;
            // console.log(`Query for ${field.resultKey}:`, query);
            // console.log(`Replacements for ${field.resultKey}:`, replacements);

            return sequelize.query(query, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }).then(results => ({
                key: field.resultKey,
                values: results.map(row => row[field.cleanKey || field.dbColumn.replace(/`/g, '')]).filter(value => value !== null && value !== undefined && String(value).trim() !== '') // Mejor filtro post-consulta
            }));
        });

        const resultsArray = await Promise.all(promises);

        const filtros = {};
        resultsArray.forEach(result => {
            filtros[result.key] = result.values;
        });

        console.log("Filtros: ", filtros);
        await registrarLog("Consulta", "Se han obtenido los filtros para la vista", req.user?.id);
        res.status(200).json(filtros);

    } catch (error) {
        console.error('Error en getVistaFiltros:', error);
        res.status(500).json({ message: error.message });
    }
};

const getVista = async (req, res) => {
    console.log(req.user?.id)
    const { fechaInicio, fechaFin, delito, submodalidad, interes, arma, especialidad, seguro, riesgo, lugar_del_hecho, comisaria } = req.body;

    console.log(req.body)

    let whereClause = []
    let replacements = {}

    // whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    if (fechaInicio && fechaFin) {
        whereClause.push(`FECHA_HECHO BETWEEN :fechaInicio AND :fechaFin`)
        replacements.fechaInicio = fechaInicio
        replacements.fechaFin = fechaFin
    }

    if (delito && delito.trim() !== '') {
        whereClause.push(`DELITO COLLATE utf8mb4_unicode_ci = :delito`);
        replacements.delito = delito;
    }

    if (submodalidad && submodalidad.trim() !== '') {
        whereClause.push(`SUBMODALIDAD COLLATE utf8mb4_unicode_ci = :submodalidad`);
        replacements.submodalidad = submodalidad;
    }

    if (arma && arma.trim() !== '') {
        whereClause.push(`\`ARMA UTILIZADA\` COLLATE utf8mb4_unicode_ci = :arma`);
        replacements.arma = arma;
    }

    if (interes !== undefined && interes !== '') {
        whereClause.push(`INTERES COLLATE utf8mb4_unicode_ci = :interes`);
        replacements.interes = interes;
    }

    if (especialidad && especialidad.trim() !== '') {
        whereClause.push(`ESPECIALIZACION COLLATE utf8mb4_unicode_ci = :especializacion`);
        replacements.especializacion = especializacion;
    }

    if (seguro && seguro.trim() !== '') {
        whereClause.push(`\`PARA SEGURO\`COLLATE utf8mb4_unicode_ci = :seguro`);
        replacements.seguro = seguro;
    }

    if (riesgo && riesgo.trim() !== '') {
        whereClause.push(`VICTIMA COLLATE utf8mb4_unicode_ci = :riesgo`);
        replacements.riesgo = riesgo;
    }

    if (lugar_del_hecho && String(lugar_del_hecho).trim() !== '') {
        whereClause.push(`Lugar_del_Hecho COLLATE utf8mb4_unicode_ci = :lugar_del_hecho`);
        replacements.lugar_del_hecho = String(lugar_del_hecho).trim();
    }

    if (comisaria && comisaria.trim() !== '') {
        whereClause.push(`COMISARIA COLLATE utf8mb4_unicode_ci = :comisaria`);
        replacements.comisaria = comisaria;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT *
            FROM denuncias_completas_v9
            ${where};
        `;

        const result = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        await registrarLog("Consulta", "Se ha realizado una consulta con filtros", req.userId);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const getVistaSinRelato = async (req, res) => {
    const { fechaInicio, fechaFin, delito, submodalidad, interes, arma, especialidad, seguro, riesgo, lugar_del_hecho, comisaria } = req.body;

    console.log(req.body)

    let whereClause = []
    let replacements = {}

    whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    if (fechaInicio && fechaFin) {
        whereClause.push(`FECHA_HECHO BETWEEN :fechaInicio AND :fechaFin`)
        replacements.fechaInicio = fechaInicio
        replacements.fechaFin = fechaFin
    }

    if (delito && delito.trim() !== '') {
        whereClause.push(`DELITO COLLATE utf8mb4_unicode_ci = :delito`);
        replacements.delito = delito;
    }

    if (submodalidad && submodalidad.trim() !== '') {
        whereClause.push(`SUBMODALIDAD COLLATE utf8mb4_unicode_ci = :submodalidad`);
        replacements.submodalidad = submodalidad;
    }

    if (arma && arma.trim() !== '') {
        whereClause.push(`\`ARMA UTILIZADA\` COLLATE utf8mb4_unicode_ci = :arma`);
        replacements.arma = arma;
    }

    if (interes !== undefined && interes !== '') {
        whereClause.push(`INTERES COLLATE utf8mb4_unicode_ci = :interes`);
        replacements.interes = interes;
    }

    if (especialidad && especialidad.trim() !== '') {
        whereClause.push(`ESPECIALIZACION COLLATE utf8mb4_unicode_ci = :especializacion`);
        replacements.especializacion = especializacion;
    }

    if (seguro && seguro.trim() !== '') {
        whereClause.push(`\`PARA SEGURO\`COLLATE utf8mb4_unicode_ci = :seguro`);
        replacements.seguro = seguro;
    }

    if (riesgo && riesgo.trim() !== '') {
        whereClause.push(`VICTIMA COLLATE utf8mb4_unicode_ci = :riesgo`);
        replacements.riesgo = riesgo;
    }

    if (lugar_del_hecho && String(lugar_del_hecho).trim() !== '') {
        whereClause.push(`Lugar_del_Hecho COLLATE utf8mb4_unicode_ci = :lugar_del_hecho`);
        replacements.lugar_del_hecho = String(lugar_del_hecho).trim();
    }

    if (comisaria && comisaria.trim() !== '') {
        whereClause.push(`COMISARIA COLLATE utf8mb4_unicode_ci = :comisaria`);
        replacements.comisaria = comisaria;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT *
            FROM denuncias_completas_v9_sin_relato
            ${where};
        `;

        const result = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const getVistaSinRelatoStaging = async (req, res) => {
    const { fechaInicio, fechaFin, delito, submodalidad, interes, arma, especialidad, seguro, riesgo, lugar_del_hecho, comisaria, unidadRegional, localidad, modalidad, elementosSustraidos, victimario } = req.body;

    console.log(req.body)

    let whereClause = []
    let likeClause = []
    let replacements = {}

    whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    if (fechaInicio && fechaFin) {
        whereClause.push(`FECHA_HECHO BETWEEN :fechaInicio AND :fechaFin`)
        replacements.fechaInicio = fechaInicio
        replacements.fechaFin = fechaFin
    }

    if (delito && delito.trim() !== '') {
        whereClause.push(`DELITO COLLATE utf8mb4_unicode_ci = :delito`);
        replacements.delito = delito;
    }

    if (submodalidad && submodalidad.trim() !== '') {
        whereClause.push(`SUBMODALIDAD COLLATE utf8mb4_unicode_ci = :submodalidad`);
        replacements.submodalidad = submodalidad;
    }

    if (arma && arma.trim() !== '') {
        whereClause.push(`\`ARMA UTILIZADA\` COLLATE utf8mb4_unicode_ci = :arma`);
        replacements.arma = arma;
    }

    if (interes !== undefined && interes !== '') {
        whereClause.push(`INTERES COLLATE utf8mb4_unicode_ci = :interes`);
        replacements.interes = interes;
    }

    if (especialidad && especialidad.trim() !== '') {
        whereClause.push(`ESPECIALIZACION COLLATE utf8mb4_unicode_ci = :especializacion`);
        replacements.especializacion = especializacion;
    }

    if (seguro && seguro.trim() !== '') {
        whereClause.push(`\`PARA SEGURO\`COLLATE utf8mb4_unicode_ci = :seguro`);
        replacements.seguro = seguro;
    }

    if (riesgo && riesgo.trim() !== '') {
        whereClause.push(`VICTIMA COLLATE utf8mb4_unicode_ci = :riesgo`);
        replacements.riesgo = riesgo;
    }

    if (lugar_del_hecho && String(lugar_del_hecho).trim() !== '') {
        whereClause.push(`Lugar_del_Hecho COLLATE utf8mb4_unicode_ci = :lugar_del_hecho`);
        replacements.lugar_del_hecho = String(lugar_del_hecho).trim();
    }

    if (comisaria && comisaria.trim() !== '') {
        whereClause.push(`COMISARIA COLLATE utf8mb4_unicode_ci = :comisaria`);
        replacements.comisaria = comisaria;
    }

    if (unidadRegional && unidadRegional.trim() !== '') {
        whereClause.push(`\`UNIDAD REGIONAL\` = CAST(:unidadRegional AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_0900_ai_ci`);
        replacements.unidadRegional = unidadRegional;
    }

    if (localidad && localidad.trim() !== '') {
        whereClause.push(`LOCALIDAD = CAST(:localidad AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_0900_ai_ci`);
        replacements.localidad = localidad;
    }

    if (modalidad && modalidad.trim() !== '') {
        whereClause.push(`MODALIDAD = CAST(:modalidad AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_0900_ai_ci`);
        replacements.modalidad = modalidad;
    }

    if (elementosSustraidos && elementosSustraidos.trim() !== '') {
        likeClause.push(`\`ELEMENTOS SUSTRAIDOS\` LIKE CAST(:elementosSustraidos AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_0900_ai_ci`);
        replacements.elementosSustraidos = `%${elementosSustraidos}%`;
    }

    if (victimario && victimario.trim() !== '') {
        likeClause.push(`VICTIMARIO LIKE CAST(:victimario AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_0900_ai_ci`);
        replacements.victimario = `%${victimario}%`;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';
    const like = likeClause.length > 0 ? (where ? ` AND ${likeClause.join(' AND ')}` : `WHERE ${likeClause.join(' AND ')}`) : '';

    try {
        const andWhere = where ? `${where} AND` : 'WHERE';

        const queries = {
            total: `SELECT COUNT(*) AS total FROM denuncias_completas_v9_sin_relato ${where} ${like}`,
            interes: `SELECT COUNT(*) AS interes FROM denuncias_completas_v9_sin_relato ${where} ${like} AND INTERES = 'SI'`,
            noInteres: `SELECT COUNT(*) AS noInteres FROM denuncias_completas_v9_sin_relato ${where} ${like} AND INTERES = 'NO'`,
            victima: `SELECT COUNT(*) AS victima FROM denuncias_completas_v9_sin_relato ${where} ${like} AND VICTIMA = 'CON RIESGO'`,
            robo: `SELECT COUNT(*) AS robo FROM denuncias_completas_v9_sin_relato ${where} ${like} AND DELITO = 'ROBO'`,
            hurtos: `SELECT COUNT(*) AS hurtos FROM denuncias_completas_v9_sin_relato ${where} ${like} AND DELITO = 'HURTOS'`,
            roboArma: `SELECT COUNT(*) AS roboArma FROM denuncias_completas_v9_sin_relato ${where} ${like} AND DELITO = 'ROBO CON ARMA DE FUEGO'`,
            porFechas: `
                SELECT DATE(FECHA_HECHO) AS fecha, COUNT(*) AS cantidad
                FROM denuncias_completas_v9_sin_relato
                ${where} ${like}
                GROUP BY DATE(FECHA_HECHO)
                ORDER BY fecha
            `,
            porFechaYHora: `
                SELECT DATE(FECHA_HECHO) AS fecha, HOUR(FECHA_HECHO) AS hora, COUNT(*) AS cantidad
                FROM denuncias_completas_v9_sin_relato
                ${where} ${like}
                GROUP BY DATE(FECHA_HECHO), HOUR(FECHA_HECHO)
                ORDER BY fecha, hora
            `,
            porDelitos: `
                SELECT DELITO AS delito, COUNT(*) AS cantidad
                FROM denuncias_completas_v9_sin_relato
                ${andWhere} ${like} DELITO IS NOT NULL AND DELITO <> ''
                GROUP BY DELITO
                ORDER BY cantidad DESC
            `,
            porModalidad: `
                SELECT MODALIDAD AS modalidad, COUNT(*) AS cantidad
                FROM denuncias_completas_v9_sin_relato
                ${andWhere} ${like} MODALIDAD IS NOT NULL AND MODALIDAD <> ''
                GROUP BY MODALIDAD
                ORDER BY cantidad DESC
            `,
            porSubmodalidad: `
                SELECT SUBMODALIDAD AS submodalidad, COUNT(*) AS cantidad
                FROM denuncias_completas_v9_sin_relato
                ${andWhere} ${like} SUBMODALIDAD IS NOT NULL AND SUBMODALIDAD <> ''
                GROUP BY SUBMODALIDAD
                ORDER BY cantidad DESC
            `,
            porElementosSustraidos: `SELECT COUNT(*) AS porElementosSustraidos FROM denuncias_completas_v9_sin_relato ${where} ${like}`,
            porVictimario: `SELECT COUNT(*) AS porVictimario FROM denuncias_completas_v9_sin_relato ${where} ${like}`,
        }

        const [total, interes, noInteres, victima, robo, hurtos, roboArma, porFechas, porFechaYHora, porDelitos, porModalidad, porSubmodalidad, porElementosSustraidos, porVictimario] = await Promise.all([
            sequelize.query(queries.total, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.interes, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.noInteres, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.victima, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.robo, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.hurtos, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.roboArma, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porFechas, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porFechaYHora, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porDelitos, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porModalidad, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porSubmodalidad, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porElementosSustraidos, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
            sequelize.query(queries.porVictimario, {
                type: Sequelize.QueryTypes.SELECT,
                replacements
            }),
        ]);

        res.status(200).json({
            total,
            interes,
            noInteres,
            victima,
            robo,
            hurtos,
            roboArma,
            porFechas,
            porFechaYHora,
            porDelitos,
            porModalidad,
            porSubmodalidad,
            porElementosSustraidos,
            porVictimario
        });
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const getVistaMapa = async (req, res) => {
    const { fechaInicio, fechaFin, delito, submodalidad, interes, arma, especialidad, seguro, riesgo, lugar_del_hecho, comisaria } = req.body;

    console.log(req.body)

    let whereClause = []
    let replacements = {}

    if (fechaInicio && fechaFin) {
        whereClause.push(`FECHA_HECHO BETWEEN :fechaInicio AND :fechaFin`)
        replacements.fechaInicio = fechaInicio
        replacements.fechaFin = fechaFin
    }

    if (delito && delito.trim() !== '') {
        whereClause.push(`DELITO COLLATE utf8mb4_unicode_ci = :delito`);
        replacements.delito = delito;
    }

    if (submodalidad && submodalidad.trim() !== '') {
        whereClause.push(`SUBMODALIDAD COLLATE utf8mb4_unicode_ci = :submodalidad`);
        replacements.submodalidad = submodalidad;
    }

    if (arma && arma.trim() !== '') {
        whereClause.push(`\`ARMA UTILIZADA\` COLLATE utf8mb4_unicode_ci = :arma`);
        replacements.arma = arma;
    }

    if (interes !== undefined && interes !== '') {
        whereClause.push(`INTERES COLLATE utf8mb4_unicode_ci = :interes`);
        replacements.interes = interes;
    }

    if (especialidad && especialidad.trim() !== '') {
        whereClause.push(`ESPECIALIZACION COLLATE utf8mb4_unicode_ci = :especializacion`);
        replacements.especializacion = especializacion;
    }

    if (seguro && seguro.trim() !== '') {
        whereClause.push(`\`PARA SEGURO\`COLLATE utf8mb4_unicode_ci = :seguro`);
        replacements.seguro = seguro;
    }

    if (riesgo && riesgo.trim() !== '') {
        whereClause.push(`VICTIMA COLLATE utf8mb4_unicode_ci = :riesgo`);
        replacements.riesgo = riesgo;
    }

    if (lugar_del_hecho && String(lugar_del_hecho).trim() !== '') {
        whereClause.push(`Lugar_del_Hecho COLLATE utf8mb4_unicode_ci = :lugar_del_hecho`);
        replacements.lugar_del_hecho = String(lugar_del_hecho).trim();
    }

    if (comisaria && comisaria.trim() !== '') {
        whereClause.push(`COMISARIA COLLATE utf8mb4_unicode_ci = :comisaria`);
        replacements.comisaria = comisaria;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT *
            FROM denuncias_mapa
            ${where};
        `;

        const result = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const getVistaEstadisticas = async (req, res) => {
    const { fechaInicio, fechaFin } = req.body;
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    let whereClause = []
    let replacements = {}

    whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    if (fechaInicio && fechaFin) {
        whereClause.push(`FECHA_HECHO BETWEEN :fechaInicio AND :fechaFin`)
        replacements.fechaInicio = fechaInicio
        replacements.fechaFin = fechaFin
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT *
            FROM denuncias_completas_v9
            ${where};
        `;

        const result = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const denuncias = result.filter((denuncia) => (denuncia['CLASIFICADA POR'] === 0 || denuncia['CLASIFICADA POR'] === 1));
        const denunciaSinInteres = denuncias.filter((denuncia) => (denuncia.INTERES === 'NO'));
        const denunciasInteres = denuncias.filter((denuncia) => (denuncia.INTERES === 'SI'));
        const habitantes = 1703186;

        const totalDenuncias = denuncias.length;
        const totalDenunciasInteres = denunciasInteres.length;
        const totalDenunciasSinInteres = denunciaSinInteres.length;

        const denunciasPorMes = denuncias.reduce((acc, denuncia) => {
            const fecha = new Date(denuncia.FECHA_HECHO);
            const anio = fecha.getUTCFullYear();
            const mesNombre = meses[fecha.getUTCMonth()];
            const clave = `${mesNombre} ${anio}`;

            if (!acc[clave]) {
                acc[clave] = 0;
            }
            acc[clave] += 1;
            return acc;
        }, {});

        const denunciasPorMesInteres = denunciasInteres.reduce((acc, denuncia) => {
            const fecha = new Date(denuncia.FECHA_HECHO);
            const anio = fecha.getUTCFullYear();
            const mesNombre = meses[fecha.getUTCMonth()];
            const clave = `${mesNombre} ${anio}`;

            if (!acc[clave]) {
                acc[clave] = 0;
            }
            acc[clave] += 1;
            return acc;
        }, {});

        const denunciasPorMesSinInteres = denunciaSinInteres.reduce((acc, denuncia) => {
            const fecha = new Date(denuncia.FECHA_HECHO);
            const anio = fecha.getUTCFullYear();
            const mesNombre = meses[fecha.getUTCMonth()];
            const clave = `${mesNombre} ${anio}`;

            if (!acc[clave]) {
                acc[clave] = 0;
            }
            acc[clave] += 1;
            return acc;
        }, {});

        const robosPorMes = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'ROBO') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()]; // getUTCMonth() devuelve 0 a 11
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        const hurtosPorMes = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'HURTOS') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()]; // getUTCMonth() devuelve 0 a 11
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        const robosArmaPorMes = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'ROBO CON ARMA DE FUEGO') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()]; // getUTCMonth() devuelve 0 a 11
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        res.status(200).json({
            totalDenuncias,
            totalDenunciasInteres,
            totalDenunciasSinInteres,
            denunciasPorMes: ordenarPorFecha(denunciasPorMes),
            denunciasPorMesInteres: ordenarPorFecha(denunciasPorMesInteres),
            denunciasPorMesSinInteres: ordenarPorFecha(denunciasPorMesSinInteres),
            robosPorMes: ordenarPorFecha(robosPorMes),
            hurtosPorMes: ordenarPorFecha(hurtosPorMes),
            robosArmaPorMes: ordenarPorFecha(robosArmaPorMes),
            habitantes
        });
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const getVistaTablaIzq = async (req, res) => {
    const { mes, anio } = req.body;

    let whereClause = []
    let replacements = {}

    whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // const mesAnterior = mes ? (parseInt(mes) - 1) : null;
    const anioAnterior = anio ? (parseInt(anio) - 1) : null;

    console.log(mes, anio, anioAnterior)

    if (mes && anioAnterior && anio) {
        whereClause.push(`
            ((YEAR(FECHA_HECHO) = :anio AND MONTH(FECHA_HECHO) = :mes) OR (YEAR(FECHA_HECHO) = :anioAnterior AND MONTH(FECHA_HECHO) = :mes))`);
        replacements.anio = anio
        replacements.mes = mes
        replacements.anioAnterior = anioAnterior
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT *
            FROM denuncias_completas_v9
            ${where};
        `;

        const result = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const denunciasInteres = result.filter((denuncia) => (denuncia.INTERES === 'SI'));

        const totalPorMesHurto = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'HURTOS') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()];
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        const totalPorMesRobo = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'ROBO') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()];;
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        const totalPorMesRoboArma = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'ROBO CON ARMA DE FUEGO') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()];;
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        res.status(200).json({
            denunciasInteres,
            totalPorMesHurto: ordenarPorFecha(totalPorMesHurto),
            totalPorMesRobo: ordenarPorFecha(totalPorMesRobo),
            totalPorMesRoboArma: ordenarPorFecha(totalPorMesRoboArma)
        });
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const getVistaTablaDer = async (req, res) => {
    const { mes, anio } = req.body;

    let whereClause = []
    let replacements = {}

    whereClause.push(`\`CLASIFICADA POR\` COLLATE utf8mb4_unicode_ci <> 2`);

    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const mesAnterior = mes ? (parseInt(mes) - 1) : null;
    //const anioAnterior = anio ? (parseInt(anio) - 1) : null;

    console.log(mes, anio, mesAnterior)

    if (mes && mesAnterior && anio) {
        whereClause.push(`
            ((YEAR(FECHA_HECHO) = :anio AND MONTH(FECHA_HECHO) = :mes) OR (YEAR(FECHA_HECHO) = :anio AND MONTH(FECHA_HECHO) = :mesAnterior))`);
        replacements.anio = anio
        replacements.mes = mes
        replacements.mesAnterior = mesAnterior
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT *
            FROM denuncias_completas_v9
            ${where};
        `;

        const result = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const denunciasInteres = result.filter((denuncia) => (denuncia.INTERES === 'SI'));

        const totalPorMesHurto = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'HURTOS') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()];
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        const totalPorMesRobo = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'ROBO') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()];;
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        const totalPorMesRoboArma = denunciasInteres.reduce((acc, denuncia) => {
            if (denuncia.DELITO === 'ROBO CON ARMA DE FUEGO') {
                const fecha = new Date(denuncia.FECHA_HECHO);
                const anio = fecha.getUTCFullYear();
                const mesNombre = meses[fecha.getUTCMonth()];;
                const clave = `${mesNombre} ${anio}`;

                if (!acc[clave]) {
                    acc[clave] = 0;
                }
                acc[clave] += 1;
            }
            return acc;
        }, {});

        res.status(200).json({
            denunciasInteres,
            totalPorMesHurto: ordenarPorFecha(totalPorMesHurto),
            totalPorMesRobo: ordenarPorFecha(totalPorMesRobo),
            totalPorMesRoboArma: ordenarPorFecha(totalPorMesRoboArma)
        });
    } catch (error) {
        console.error('Error en getVista:', error);
        res.status(500).json({ message: error.message });
    }
}

const prueba = (req, res) => {
    res.status(200).json({
        message: "Hola mundo desde el controlador de usuario"
    });
};

const getManifest = (req, res) => {
    try {
        // Forzar el tipo correcto
        res.setHeader("Content-Type", "application/manifest+json");

        // Obtener referer de forma segura
        const referer = req.get('referer') || '';
        console.log("=== Manifest Request ===");
        console.log("Headers recibidos:", req.headers);
        console.log("Referer:", referer);

        // Elegir manifest según referer
        if (referer.includes('/sgd')) {
            console.log("Se sirve manifest para SGD");
            res.json({
                name: "Sistema de Gestión de Denuncias",
                short_name: "SGD",
                start_url: "/sgd",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#ff6600",
                icons: [
                    { src: "/img_logo.png", sizes: "192x192", type: "image/png" },
                    { src: "/img_logo.png", sizes: "512x512", type: "image/png" }
                ]
            });
        } else {
            console.log("Se sirve manifest por defecto SCG");
            res.json({
                name: "Sistema de Control de Gestión",
                short_name: "SCG",
                start_url: "/",
                display: "standalone",
                background_color: "#000000",
                theme_color: "#005CA2",
                icons: [
                    { src: "/img_logo.png", sizes: "192x192", type: "image/png" },
                    { src: "/img_logo.png", sizes: "512x512", type: "image/png" }
                ]
            });
        }
    } catch (err) {
        console.error("Error en getManifest:", err);
        res.status(500).send("Error interno en el manifest");
    }
};


const login = async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const usuario = await Usuario.findOne({
            where: {
                email: email
            }
        });
        if (usuario) {
            const match = bcrypt.compareSync(contraseña, usuario.contraseña);
            if (match) {
                const token = jwt.sign({
                    id: usuario.dni,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    rol: usuario.rolId,
                    foto: usuario.userFoto
                }, process.env.JWT_SECRET, {
                    expiresIn: '5h'
                });

                res.cookie('token', token, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 18000000
                })

                const log = {
                    accion: "Login",
                    descripcion: `El usuario ${usuario.nombre} ${usuario.apellido} ha iniciado sesión`,
                    dniId: usuario.dni
                }

                await registrarLog(log.accion, log.descripcion, log.dniId);

                res.status(200).json({
                    token: token,
                    message: "Usuario logueado correctamente"
                });
            } else {
                res.status(400).json({
                    message: "Usuario o contraseña incorrectos"
                });
            }
        } else {
            res.status(400).json({
                message: "Usuario o contraseña incorrectos"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            message: "Usuario deslogueado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();

        await registrarLog("Listar", "Se han listado todos los usuarios", req.userId);

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        await registrarLog("Listar", `Se ha listado el usuario ${usuario.nombre} ${usuario.apellido}`, req.userId);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const usuario = await Usuario.create({
            dni: req.body.dni,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
            puesto: req.body.puesto,
            rolId: req.body.rolId,
            userFoto: req.body.userFoto
        });

        const log = {
            accion: "Crear",
            descripcion: `El usuario ${usuario.nombre} ${usuario.apellido} ha sido creado`
        }

        await registrarLog(log.accion, log.descripcion, req.userId);


        res.status(201).json(usuario)
    } catch (error) {
        console.error('Error al crear el usuario: ', error.errors)
        res.status(500).json({
            message: error.message,
            stack: error.stack,
            detail: error.errors || null
        })
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    if (req.body.contraseña) {
        req.body.contraseña = bcrypt.hashSync(req.body.contraseña, 10);
    }
    try {
        const usuario = await Usuario.update({
            dni: req.body.dni,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            contraseña: req.body.contraseña,
            telefono: req.body.telefono,
            puesto: req.body.puesto,
            rolId: req.body.rolId,
            userFoto: req.body.userFoto
        }, {
            where: {
                dni: id
            }
        });

        const log = {
            accion: "Actualizar",
            descripcion: `El usuario ${req.body.nombre} ${req.body.apellido} ha sido actualizado`
        }

        await registrarLog(log.accion, log.descripcion, req.userId);

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await Usuario.destroy({
            where: {
                dni: id
            }
        });

        const log = {
            accion: "Eliminar",
            descripcion: `El usuario con el id ${id} ha sido eliminado`
        }

        await registrarLog(log.accion, log.descripcion, req.userId);

        res.status(200).json({
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export { getVistaSinRelatoStaging, getRankingObservada, getVistaMapa, prueba, login, getAllUsers, getUserById, createUser, updateUser, deleteUser, logout, getVista, getVistaFiltros, getVistaEstadisticas, getRanking, getVistaTablaIzq, getVistaTablaDer, getVistaSinRelato, getRankingDiario, getManifest };