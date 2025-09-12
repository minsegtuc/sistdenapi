import express from 'express';
import { getVistaMapa, prueba, getAllUsers, getUserById, createUser, updateUser, deleteUser, login, logout, getVista, getVistaFiltros, getRanking, getVistaEstadisticas, getVistaTablaIzq, getVistaTablaDer, getVistaSinRelato, getRankingDiario } from '../controllers/usuario.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();

router.get('/prueba', prueba)
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', verifyToken, getAllUsers);
router.get('/user/:id', verifyToken, getUserById);
router.get('/ranking', verifyToken, getRanking)
router.get('/rankingDiario', verifyToken, getRankingDiario)
router.post('/vista', getVista)
router.post('/vistaSinRelato', getVistaSinRelato)
router.post('/vistaMapa', getVistaMapa)
router.post('/filtros', verifyToken, getVistaFiltros)
router.post('/estadisticas', verifyToken, getVistaEstadisticas)
router.post('/tablaizq', verifyToken, getVistaTablaIzq)
router.post('/tabladerecha', verifyToken, getVistaTablaDer);
router.post('/user', verifyToken, createUser);
router.put('/user/:id', verifyToken, updateUser);
router.delete('/user/:id', verifyToken, deleteUser);

export default router;