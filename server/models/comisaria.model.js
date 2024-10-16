import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Comisaria = sequelize.define('Comisaria', {
    idComisaria: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(45),
        allowNull: true
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
    },
    unidadRegionalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'unidadRegional',
            key: 'idUnidadRegional'
        }
    }
}, {tableName: 'comisaria', timestamps: false});

export default Comisaria;