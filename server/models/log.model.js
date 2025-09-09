import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Log = sequelize.define('Log', {
    idLog: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    accion: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(600),
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dniId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {tableName: 'log', timestamps: false});

export default Log;