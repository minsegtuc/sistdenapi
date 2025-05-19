import ObjetoIA from "../models/objetoIa.model.js";

const getAllObjetosIA = async (req, res) => {
    try {
        const objetosIA = await ObjetoIA.findAll();
        res.status(200).json(objetosIA);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getObjetoIAById = async (req, res) => {
    const { id } = req.params;
    try {
        const objetoIA = await ObjetoIA.findByPk(id);
        res.status(200).json(objetoIA);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createObjetoIA = async (req, res) => {
    const { objetoIA } = req.body;
    const errores = []
    console.log(objetoIA)

    try {
        const resObjetoIA = await ObjetoIA.create({
            nro_denuncia: objetoIA.nro_denuncia,
            intentos: objetoIA.intentos,
            totalPromptTokens: objetoIA.totalPromptTokens,
            totalResponseTokens: objetoIA.totalResponseTokens,
            avgLogprobs: objetoIA.avgLogprobs,
            resultado_victima: objetoIA.resultado_victima,
            resultado_victimario: objetoIA.resultado_victimario,
            resultado_lugar: objetoIA.resultado_lugar,
            resultado_accion_posterior: objetoIA.resultado_accion_posterior,
            resultado_relato_resaltado: objetoIA.resultado_relato_resaltado,
            relato_mpf: objetoIA.relato_mpf,
            resultado_modus_operandi: objetoIA.resultado_modus_operandi,
            resultado_para_seguro: objetoIA.resultado_para_seguro,
            resultado_elementos_sustraidos: objetoIA.resultado_elementos_sustraidos,
            resultado_geocoding: objetoIA.resultado_geocoding
        });
        res.status(201).json(resObjetoIA);
    } catch (error) {
        console.error(`Error al procesar la denuncia ${objetoIA.nro_denuncia}:` , error.message)

        errores.push({
            denuncia: objetoIA.nro_denuncia,
            error: error.message
        })

        res.status(400).json({ errores });
    }
}

export { getAllObjetosIA, getObjetoIAById, createObjetoIA };