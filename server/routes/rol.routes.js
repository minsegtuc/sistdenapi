import express from 'express';
import { getAllRol, getRolById, createRol, updateRol, deleteRol } from '../controllers/rol.controller.js';

const router = express.Router();
router.get('/rol', getAllRol);
router.get('/rol/:id', getRolById);
router.post('/rol', createRol);
router.put('/rol/:id', updateRol);
router.delete('/rol/:id', deleteRol);

export default router;