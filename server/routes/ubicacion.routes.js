import express from 'express';
import { getAllUbicaciones, getUbicacionById, createUbicacion, updateUbicacion, deleteUbicacion } from '../controllers/ubicacion.controller.js';

const router = express.Router();
router.get('/ubicacion', getAllUbicaciones);
router.get('/ubicacion/:id', getUbicacionById);
router.post('/ubicacion', createUbicacion);
router.put('/ubicacion/:id', updateUbicacion);
router.delete('/ubicacion/:id', deleteUbicacion);

export default router;