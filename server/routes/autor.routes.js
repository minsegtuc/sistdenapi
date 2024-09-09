import express from 'express';
import { getAllAutor, getAutorById, createAutor, updateAutor, deleteAutor } from '../controllers/autor.controller.js';

const router = express.Router();
router.get('/autor', getAllAutor);
router.get('/autor/:id', getAutorById);
router.post('/autor', createAutor);
router.put('/autor/:id', updateAutor);
router.delete('/autor/:id', deleteAutor);

export default router;