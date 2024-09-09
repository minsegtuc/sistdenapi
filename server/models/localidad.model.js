import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Localidad = sequelize.define('Localidad' , {
    idLocalidad: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(100)
    },
    departamentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'departamento',
            key: 'idDepartamento'
        }
    }
}, {tableName: 'localidad', timestamps: false})

export default Localidad;