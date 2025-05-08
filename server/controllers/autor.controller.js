import Autor from '../models/autor.model.js';

const getAllAutor = async (req, res) => {
    try {
        const autores = await Autor.findAll({
            order: [['descripcion','ASC']]
        });
        res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAutorById = async (req, res) => {
    const { id } = req.params;
    try {
        const autor = await Autor.findByPk(id);
        res.status(200).json(autor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createAutor = async (req, res) => {
    try {
        const autor = await Autor.create({
            idAutor: req.body.idAutor,
            descripcion: req.body.descripcion
        });

        res.status(201).json(autor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateAutor = async (req, res) => {
    const { id } = req.params;
    try {
        const autor = await Autor.update({
            descripcion: req.body.descripcion
        }, {
            where: {
                idAutor: id
            }
        });

        res.status(200).json(autor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteAutor = async (req, res) => {
    const { id } = req.params;
    try {
        const autor = await Autor.destroy({
            where: {
                idAutor: id
            }
        });

        res.status(200).json(autor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllAutor, getAutorById, createAutor, updateAutor, deleteAutor };