import express from 'express';
import { getAllSubmodalidades, getSubmodalidadById, createSubmodalidad, updateSubmodalidad, deleteSubmodalidad, getSubmodalidadByName } from '../controllers/submodalidad.controller.js';

const router = express.Router();
router.get('/submodalidad', getAllSubmodalidades);
router.get('/submodalidad/:id', getSubmodalidadById);
router.get('/nombre/:name', getSubmodalidadByName)
router.post('/submodalidad', createSubmodalidad);
router.put('/submodalidad/:id', updateSubmodalidad);
router.delete('/submodalidad/:id', deleteSubmodalidad);

export default router;