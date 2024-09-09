import express from 'express';
import { getAllMovilidades, getMovilidadById, createMovilidad, updateMovilidad, deleteMovilidad } from '../controllers/movilidad.controller.js';

const router = express.Router();
router.get('/movilidad', getAllMovilidades);
router.get('/movilidad/:id', getMovilidadById);
router.post('/movilidad', createMovilidad);
router.put('/movilidad/:id', updateMovilidad);
router.delete('/movilidad/:id', deleteMovilidad);

export default router;