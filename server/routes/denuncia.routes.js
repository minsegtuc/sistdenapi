import express from 'express';
import { getAllDenuncias, getDenunciaById, createDenuncia, updateDenuncia, deleteDenuncia, countDenunciasSC, getDuplicadas, getAllLike, getAllRegional, denunciaTrabajando, getDenunciaReciente, getTotalDenuncias, getTotalInteres, getInteresTotalGrafica, getDelitoGrafica, getTablaInteres, getTablaMensual} from '../controllers/denuncia.controller.js';

const router = express.Router();
router.get('/denuncia/count', countDenunciasSC);
router.get('/denuncia/:clasificada', getAllDenuncias);
router.get('/reciente', getDenunciaReciente)
router.get('/total', getTotalDenuncias)
router.get('/interes', getTotalInteres)
router.get('/graficainterestotal', getInteresTotalGrafica)
router.get('/graficadelito', getDelitoGrafica)
router.get('/tablaInteres', getTablaInteres)
router.get('/mensual', getTablaMensual)
router.get('/:id', getDenunciaById);
router.post('/duplicadas', getDuplicadas)
router.post('/denuncia', createDenuncia);
router.post('/trabajando', denunciaTrabajando);
router.post('/denuncialike', getAllLike);
router.post('/regional', getAllRegional);
router.put('/denuncia/:id', updateDenuncia);
router.delete('/denuncia/:id', deleteDenuncia);

export default router;