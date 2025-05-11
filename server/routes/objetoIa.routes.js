import express from 'express';
import { getAllObjetosIA, getObjetoIAById, createObjetoIA } from '../controllers/objetoIa.controller.js';

const router = express.Router();
router.get('/objetoIA', getAllObjetosIA);
router.get('/objetoIA/:id', getObjetoIAById);
router.post('/objetoIA', createObjetoIA);

export default router;