import express from 'express';
import verifyToken from '../middleware/jwt.js';
import { updateClasificacion, getAllDenuncias, getDenunciaById, getDenunciaByIdVista, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllRegional, denunciaTrabajando, getDenunciaReciente, getTablaInteres, getTablaMensual, getAño, getEstadisticasClasificacion, getEstadisticasSankey, getEstadisticasSubmodalidad} from '../controllers/denuncia.controller.js';

const router = express.Router();
router.get('/denuncia/count', verifyToken, countDenunciasSC);
router.get('/denuncia/:clasificada', verifyToken, getAllDenuncias);
router.get('/reciente', verifyToken, getDenunciaReciente)
router.get('/tablaInteres', verifyToken, getTablaInteres)
router.get('/mensual', verifyToken, getTablaMensual)
router.get('/anio', verifyToken, getAño);
router.post('/estadisticasClasificacion', verifyToken, getEstadisticasClasificacion);
router.post('/estadisticasSubmodalidad', verifyToken, getEstadisticasSubmodalidad);
router.post('/estadisticasSankey', verifyToken, getEstadisticasSankey);
router.get('/:id', verifyToken, getDenunciaById);
router.post('/denuncia/buscar', verifyToken, getDenunciaByIdVista);
router.post('/duplicadas', verifyToken, getDuplicadas)
router.post('/denuncia', verifyToken, createDenuncia);
router.post('/trabajando', verifyToken, denunciaTrabajando);
router.post('/regional', verifyToken, getAllRegional);
router.put('/update', verifyToken, updateDenuncia);
router.put('/observar', verifyToken, updateClasificacion);
router.delete('/denuncia/:id', verifyToken, deleteDenuncia);

export default router;