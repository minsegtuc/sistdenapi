import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Denuncia = sequelize.define('denuncia', {
    idDenuncia: {
        type: DataTypes.STRING(25),
        primaryKey: true,
    },
    fechaDenuncia: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    dniDenunciante: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    interes: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    aprehendido: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    medida: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    seguro: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    elementoSustraido: {
        type: DataTypes.STRING(1024),
        allowNull: true,
    },
    fechaDelito: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    horaDelito: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fiscalia: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    tipoArmaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'tipoArma',
            key: 'idTipoArma'
        }
    },
    movilidadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'movilidad',
            key: 'idMovilidad'
        }
    },
    autorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'autor',
            key: 'idAutor'
        }
    },
    victima: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    domicilio_victima: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    localidad_victima: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    victimario: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    especializacionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'especializacion',
            key: 'idEspecializacion'
        }
    },
    comisariaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'comisaria',
            key: 'idComisaria'
        }
    },
    ubicacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'ubicacion',
            key: 'idUbicacion'
        }
    },
    submodalidadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'submodalidad',
            key: 'idSubmodalidad'
        }
    },
    tipoDelitoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'tipoDelito',
            key: 'idTipoDelito'
        }
    },
    cantidad_victimario: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    isClassificated: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    trabajando: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    relato: {
        type: DataTypes.STRING(10000),
        allowNull: true
    },
    lugar_del_hecho: {
        type: DataTypes.STRING(1000),
        allowNull: true
    },
}, {tableName: 'denuncia', timestamps: false});

export default Denuncia;