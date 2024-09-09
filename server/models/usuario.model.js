import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = sequelize.define('Usuario', {
    dni: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            name: 'email',
        }
    },
    contraseña:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    puesto: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    userFoto: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    rolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rol',
            key: 'idRol'
        }
    }
}, {
    tableName: 'usuario',
    timestamps: false,
    hooks: {
        beforeCreate: (usuario) => {
            usuario.contraseña = bcrypt.hashSync(usuario.contraseña, 10);
        },
        beforeUpdate: (usuario) => {
            usuario.contraseña = bcrypt.hashSync(usuario.contraseña, 10);
        },
    }
})

export default Usuario;