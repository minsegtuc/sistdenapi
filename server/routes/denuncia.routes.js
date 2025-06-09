import express from 'express';
import { getAllDenuncias, getDenunciaById, getDenunciaByIdVista, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllRegional, denunciaTrabajando, getDenunciaReciente, getTablaInteres, getTablaMensual, getAño, getEstadisticasClasificacion, getEstadisticasSankey, getEstadisticasSubmodalidad} from '../controllers/denuncia.controller.js';

const router = express.Router();
router.get('/denuncia/count', countDenunciasSC);
router.get('/denuncia/:clasificada', getAllDenuncias);
router.get('/reciente', getDenunciaReciente)
router.get('/tablaInteres', getTablaInteres)
router.get('/mensual', getTablaMensual)
router.get('/anio', getAño);
router.post('/estadisticasClasificacion', getEstadisticasClasificacion);
router.post('/estadisticasSubmodalidad', getEstadisticasSubmodalidad);
router.post('/estadisticasSankey', getEstadisticasSankey);
router.get('/:id', getDenunciaById);
router.post('/denuncia/buscar', getDenunciaByIdVista);
router.post('/duplicadas', getDuplicadas)
router.post('/denuncia', createDenuncia);
router.post('/trabajando', denunciaTrabajando);
router.post('/regional', getAllRegional);
router.put('/update', updateDenuncia);
router.delete('/denuncia/:id', deleteDenuncia);

export default router;