import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ObjetoIA = sequelize.define('ObjetoIA', {
    nro_denuncia: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    intentos: DataTypes.INTEGER,
    totalPromptTokens: DataTypes.INTEGER,
    totalResponseTokens: DataTypes.INTEGER,
    avgLogprobs: DataTypes.FLOAT,
    resultado_victima: DataTypes.JSON,
    resultado_victimario: DataTypes.JSON,
    resultado_lugar: DataTypes.JSON,
    resultado_accion_posterior: DataTypes.JSON,
    resultado_relato_resaltado: DataTypes.TEXT,
    relato_mpf: DataTypes.TEXT,
    resultado_modus_operandi: DataTypes.STRING,
    resultado_para_seguro: DataTypes.BOOLEAN,
    resultado_elementos_sustraidos: DataTypes.JSON,
    resultado_geocoding: DataTypes.JSON
}, {
    tableName: 'objeto_ia',
    timestamps: false,
});

export default ObjetoIA;
