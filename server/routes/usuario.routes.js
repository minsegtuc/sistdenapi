import express from 'express';
import { prueba, getAllUsers, getUserById, createUser, updateUser, deleteUser, login, logout, getVista, getVistaFiltros } from '../controllers/usuario.controller.js';
import verifyToken from '../middleware/jwt.js';

const router = express.Router();

router.get('/prueba', prueba)
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', verifyToken, getAllUsers);
router.get('/user/:id', verifyToken, getUserById);
router.post('/vista', getVista)
router.post('/filtros', getVistaFiltros)
router.post('/user', verifyToken, createUser);
router.put('/user/:id', verifyToken, updateUser);
router.delete('/user/:id', verifyToken, deleteUser);

export default router;