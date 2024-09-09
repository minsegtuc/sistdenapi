import express from 'express';
import { getAllLogs, getLogById, createLog, updateLog, deleteLog } from '../controllers/log.controller.js';

const router = express.Router();
router.get('/log', getAllLogs);
router.get('/log/:id', getLogById);
router.post('/log', createLog);
router.put('/log/:id', updateLog);
router.delete('/log/:id', deleteLog);

export default router;