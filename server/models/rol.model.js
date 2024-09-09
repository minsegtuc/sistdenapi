import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Rol = sequelize.define('Rol', {
    idRol: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {tableName: 'rol', timestamps: false});

export default Rol;