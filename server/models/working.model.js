import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Working = sequelize.define('working', {
    idDenunciaWork: {
        type: DataTypes.STRING(25),
        primaryKey: true,
    },
    usuario: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {tableName: 'working', timestamps: false});

export default Working;