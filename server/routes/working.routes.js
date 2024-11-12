import express from 'express';
import { getAllWorking, createWorking, deleteWorkingById } from "../controllers/working.controller.js";

const router = express.Router()
router.get('/workings', getAllWorking);
router.post('/create', createWorking)
router.delete('/delete/:id', deleteWorkingById);

export default router;