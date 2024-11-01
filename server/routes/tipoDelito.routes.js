import express from 'express';
import { getAllTipoDelitos, getTipoDelitoById, createTipoDelito, updateTipoDelito, deleteTipoDelito, getTipoDelitoByName } from '../controllers/tipoDelito.controller.js';

const router = express.Router();
router.get('/tipoDelito', getAllTipoDelitos);
router.get('/tipoDelito/:id', getTipoDelitoById);
router.get('/nombre/:name', getTipoDelitoByName);
router.post('/tipoDelito', createTipoDelito);
router.put('/tipoDelito/:id', updateTipoDelito);
router.delete('/tipoDelito/:id', deleteTipoDelito);

export default router;