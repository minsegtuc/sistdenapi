import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TipoDelito = sequelize.define('tipoDelito', {
    idTipoDelito: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
}, {tableName: 'tipoDelito', timestamps: false});

export default TipoDelito;