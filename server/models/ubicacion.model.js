import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Ubicacion = sequelize.define('Ubicacion', {
    idUbicacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    latitud: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    longitud: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    domicilio: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    domicilio_ia: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    tipo_precision: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    poligono: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    localidadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'localidad',
            key: 'idLocalidad'
        }
    }
}, {tableName: 'ubicacion', timestamps: false});

export default Ubicacion;