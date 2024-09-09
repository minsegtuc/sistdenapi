import express from 'express';
import { getAllLocalidades, getLocalidadById, createLocalidad, updateLocalidad, deleteLocalidad } from '../controllers/localidad.controller.js';

const router = express.Router();
router.get('/localidad', getAllLocalidades);
router.get('/localidad/:id', getLocalidadById);
router.post('/localidad', createLocalidad);
router.put('/localidad/:id', updateLocalidad);
router.delete('/localidad/:id', deleteLocalidad);

export default router;