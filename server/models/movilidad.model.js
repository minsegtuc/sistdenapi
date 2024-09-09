import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Movilidad = sequelize.define('movilidad', {
    idMovilidad: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false,
    }
}, {tableName: 'movilidad', timestamps: false});

export default Movilidad;