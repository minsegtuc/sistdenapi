import express from 'express';
import { getAllTipoArmas, getTipoArmaById, createTipoArma, updateTipoArma, deleteTipoArma } from '../controllers/tipoArma.controller.js';

const router = express.Router();
router.get('/tipoArma', getAllTipoArmas);
router.get('/tipoArma/:id', getTipoArmaById);
router.post('/tipoArma', createTipoArma);
router.put('/tipoArma/:id', updateTipoArma);
router.delete('/tipoArma/:id', deleteTipoArma);

export default router;