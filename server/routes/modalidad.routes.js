import express from 'express';
import { getAllModalidades, getModalidadById, createModalidad, updateModalidad, deleteModalidad } from '../controllers/modalidad.controller.js';

const router = express.Router();
router.get('/modalidad', getAllModalidades);
router.get('/modalidad/:id', getModalidadById);
router.post('/modalidad', createModalidad);
router.put('/modalidad/:id', updateModalidad);
router.delete('/modalidad/:id', deleteModalidad);

export default router;