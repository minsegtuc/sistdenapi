import Working from '../models/working.model.js'
import sequelize from '../config/db.js'

const getAllWorking = async (req, res) => {
    try {
        const working = await Working.findAll()

        res.status(200).json(working)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createWorking = async (req, res) => {
    const { registroWorking } = req.body
    try {
        const working = await Working.create({
            idDenunciaWork: registroWorking.idDenuncia,
            usuario: registroWorking.usuario
        })

        res.status(201).json(working)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const deleteWorkingById = async (req,res) => {
    const {id} = req.params
    try {
        await Working.destroy({
            where: {
                idDenunciaWork: id
            }
        })
        
        res.status(200).json
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export { getAllWorking, createWorking, deleteWorkingById };