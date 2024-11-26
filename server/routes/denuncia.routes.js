import express from 'express';
import { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllLike, getAllRegional, denunciaTrabajando } from '../controllers/denuncia.controller.js';

const router = express.Router();
router.get('/denuncia/:clasificada', getAllDenuncias);
router.get('/denuncia/:id', getDenunciaById);
router.post('/duplicadas', getDuplicadas)
router.post('/denuncia', createDenuncia);
router.post('/trabajando', denunciaTrabajando);
router.post('/denuncialike', getAllLike);
router.post('/regional', getAllRegional);
router.put('/denuncia/:id', updateDenuncia);
router.delete('/denuncia/:id', deleteDenuncia);
router.get('/count', countDenunciasSC)

export default router;