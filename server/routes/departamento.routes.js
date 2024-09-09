import express from 'express';
import { getAllDepartamentos, getDepartamentoById, createDepartamento, updateDepartamento, deleteDepartamento } from '../controllers/departamento.controller.js';

const router = express.Router();
router.get('/departamento', getAllDepartamentos);
router.get('/departamento/:id', getDepartamentoById);
router.post('/departamento', createDepartamento);
router.put('/departamento/:id', updateDepartamento);
router.delete('/departamento/:id', deleteDepartamento);

export default router;