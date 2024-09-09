import express from 'express';
import { getAllUnidadesRegionales, getUnidadRegionalById, createUnidadRegional, updateUnidadRegional, deleteUnidadRegional } from '../controllers/unidadRegional.controller.js';

const router = express.Router();
router.get('/unidadRegional', getAllUnidadesRegionales);
router.get('/unidadRegional/:id', getUnidadRegionalById);
router.post('/unidadRegional', createUnidadRegional);
router.put('/unidadRegional/:id', updateUnidadRegional);
router.delete('/unidadRegional/:id', deleteUnidadRegional);

export default router;