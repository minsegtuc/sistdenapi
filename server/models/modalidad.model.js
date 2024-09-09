import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Modalidad = sequelize.define('modalidad', {
    idModalidad: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {tableName: 'modalidad', timestamps: false});

export default Modalidad;