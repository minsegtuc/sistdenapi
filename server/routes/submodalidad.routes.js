import express from 'express';
import { getAllSubmodalidades, getSubmodalidadById, createSubmodalidad, updateSubmodalidad, deleteSubmodalidad } from '../controllers/submodalidad.controller.js';

const router = express.Router();
router.get('/submodalidad', getAllSubmodalidades);
router.get('/submodalidad/:id', getSubmodalidadById);
router.post('/submodalidad', createSubmodalidad);
router.put('/submodalidad/:id', updateSubmodalidad);
router.delete('/submodalidad/:id', deleteSubmodalidad);

export default router;