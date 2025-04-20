import express from 'express';
import { getAllUbicacionesAuxiliar, getUbicacionAuxiliarById, createUbicacionAuxiliar, updateUbicacionAuxiliar, deleteUbicacionAuxiliar } from '../controllers/ubicacionAuxiliar.controller.js';

const router = express.Router();
router.get('/ubicacionAuxiliar', getAllUbicacionesAuxiliar);
router.get('/ubicacionAuxiliar/:id', getUbicacionAuxiliarById);
router.post('/ubicacionAuxiliar', createUbicacionAuxiliar);
router.put('/ubicacionAuxiliar/:id', updateUbicacionAuxiliar);
router.delete('/ubicacionAuxiliar/:id', deleteUbicacionAuxiliar);

export default router;