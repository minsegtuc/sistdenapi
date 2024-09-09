import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Especializacion = sequelize.define('especializacion', {
    idEspecializacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false,
    }
}, {tableName: 'especializacion', timestamps: false});

export default Especializacion;