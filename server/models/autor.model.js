import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Autor = sequelize.define('Autor', {
    idAutor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, { tableName: 'autor', timestamps: false });

export default Autor;