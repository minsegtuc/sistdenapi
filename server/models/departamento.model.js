import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Departamento = sequelize.define('Departamento', {
    idDepartamento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {tableName: 'departamento', timestamps: false});

export default Departamento;