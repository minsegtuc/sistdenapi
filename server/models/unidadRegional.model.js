import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UnidadRegional = sequelize.define('unidadRegional', {
    idUnidadRegional: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ubicacionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'ubicacion',
            key: 'idUbicacion'
        }
    }
}, {tableName: 'unidadRegional', timestamps: false});

export default UnidadRegional;