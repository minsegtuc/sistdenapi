import express from 'express';
import { getAllComisarias, getComisariaById, createComisaria, updateComisaria, deleteComisaria, getComisariaByName } from '../controllers/comisaria.controller.js';

const router = express.Router();
router.get('/comisaria', getAllComisarias);
router.get('/comisaria/:id', getComisariaById);
router.get('/nombre/:name', getComisariaByName);
router.post('/comisaria', createComisaria);
router.put('/comisaria/:id', updateComisaria);
router.delete('/comisaria/:id', deleteComisaria);

export default router;