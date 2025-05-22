import Usuario from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "../config/db.js";
import { Op, fn, col, literal, Sequelize } from "sequelize";
import { registrarLog } from "../helpers/logHelpers.js";

dotenv.config();

const getRanking = async (req, res) => {
    const { fechaDesde, fechaHasta } = req.query;

    try {
        let baseQuery = `
            SELECT usuario.nombre, COUNT(DISTINCT log.descripcion) AS cantidad_clasificadas
            FROM log
            INNER JOIN usuario ON log.dniId = usuario.dni
            WHERE accion = 'UPDATE'
              AND log.dniId <> 38243415
        `;

        // const replacements = { fecha };
        let replacements = {};

        if (fechaDesde && fechaHasta) {
            baseQuery += ` AND fecha >= :fechaDesde AND fecha <= :fechaHasta`;
            replacements.fechaDesde = fechaDesde;
            replacements.fechaHasta = fechaHasta;
        }

        baseQuery += `
            GROUP BY usuario.nombre
            ORDER BY cantidad_clasificadas DESC
        `;

        const ranking = await sequelize.query(baseQuery, {
            replacements,
            type: Sequelize.QueryTypes.SELECT
        });

        res.status(200).json(ranking);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getVistaFiltros = async (req, res) => {
    const { delito, submodalidad, interes, arma, especialidad, riesgo, seguro } = req.body;

    let whereClause = [];
    let replacements = {};

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

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    try {
        const query = `
            SELECT
                GROUP_CONCAT(DISTINCT DELITO) AS delitos,
                GROUP_CONCAT(DISTINCT SUBMODALIDAD) AS submodalidades,
                GROUP_CONCAT(DISTINCT \`ARMA UTILIZADA\`) AS armas,
                GROUP_CONCAT(DISTINCT ESPECIALIZACION) AS especializaciones,
                GROUP_CONCAT(DISTINCT \`PARA SEGURO\`) AS seguros,
                GROUP_CONCAT(DISTINCT VICTIMA) AS riesgos,
                GROUP_CONCAT(DISTINCT INTERES) AS intereses
            FROM denuncias_completas_v9
            ${where};
        `;

        const [result] = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        const filtros = {
            delitos: result.delitos ? result.delitos.split(',') : [],
            submodalidades: result.submodalidades ? result.submodalidades.split(',') : [],
            armas: result.armas ? result.armas.split(',') : [],
            especializaciones: result.especializaciones ? result.especializaciones.split(',') : [],
            seguros: result.seguros ? result.seguros.split(',') : [],
            riesgos: result.riesgos ? result.riesgos.split(',') : [],
            intereses: result.intereses ? result.intereses.split(',') : []
        };

        console.log("Filtros: " , filtros)

        res.status(200).json(filtros);
    } catch (error) {
        console.error('Error en getVistaFiltros:', error);
        res.status(500).json({ message: error.message });
    }
};

const getVista = async (req, res) => {
    const { fechaInicio, fechaFin, delito, submodalidad, interes, arma, especialidad, seguro, riesgo } = req.body;

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

        res.status(200).json(result);
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

                res.cookie('auth_token', token, {
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
        res.clearCookie('auth_token');
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

export { prueba, login, getAllUsers, getUserById, createUser, updateUser, deleteUser, logout, getVista, getVistaFiltros, getRanking };