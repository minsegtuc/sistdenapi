import express from 'express';
import { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC } from '../controllers/denuncia.controller.js';

const router = express.Router();
router.get('/denuncia', getAllDenuncias);
router.get('/denuncia/:id', getDenunciaById);
router.post('/denuncia', createDenuncia);
router.put('/denuncia/:id', updateDenuncia);
router.delete('/denuncia/:id', deleteDenuncia);
router.get('/count', countDenunciasSC)

export default router;