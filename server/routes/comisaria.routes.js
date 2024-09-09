import express from 'express';
import { getAllComisarias, getComisariaById, createComisaria, updateComisaria, deleteComisaria } from '../controllers/comisaria.controller.js';

const router = express.Router();
router.get('/comisaria', getAllComisarias);
router.get('/comisaria/:id', getComisariaById);
router.post('/comisaria', createComisaria);
router.put('/comisaria/:id', updateComisaria);
router.delete('/comisaria/:id', deleteComisaria);

export default router;