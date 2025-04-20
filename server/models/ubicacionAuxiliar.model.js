import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UbicacionAuxiliar = sequelize.define('UbicacionAuxiliar', {
    idUbicacionAuxiliar: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    latitudAuxiliar: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    longitudAuxiliar: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tipo_precision: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    domicilioAuxiliar: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    // estadoAuxiliar: {
    //     type: DataTypes.STRING(100),
    //     allowNull: true
    // },
    localidadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'localidad',
            key: 'idLocalidad'
        }
    },
    denunciaId:{
        type: DataTypes.STRING(25),
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'denuncia',
            key: 'idDenuncia'
        }
    }
}, { tableName: 'ubicacionAuxiliar', timestamps: false });

export default UbicacionAuxiliar;   