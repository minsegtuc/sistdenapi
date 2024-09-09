import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TipoArma = sequelize.define('tipoArma', {
    idTipoArma: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, { tableName: 'tipoArma', timestamps: false });

export default TipoArma;