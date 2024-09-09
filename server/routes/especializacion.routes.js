import express from 'express';
import { getAllEspecializaciones, getEspecializacionById, createEspecializacion, updateEspecializacion, deleteEspecializacion } from '../controllers/especializacion.controller.js';

const router = express.Router();
router.get('/especializacion', getAllEspecializaciones);
router.get('/especializacion/:id', getEspecializacionById);
router.post('/especializacion', createEspecializacion);
router.put('/especializacion/:id', updateEspecializacion);
router.delete('/especializacion/:id', deleteEspecializacion);

export default router;