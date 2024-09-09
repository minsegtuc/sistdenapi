import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Submodalidad = sequelize.define('submodalidad', {
    idSubmodalidad: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    tipoDelitoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tipoDelito',
            key: 'idTipoDelito'
        }
    },
    modalidadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modalidad',
            key: 'idModalidad'
        }
    }
}, {tableName: 'submodalidad', timestamps: false});

export default Submodalidad;