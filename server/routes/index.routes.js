import AutorRutas from './autor.routes.js';
import ComisariaRutas from './comisaria.routes.js';
import DepartamentoRutas from './departamento.routes.js';
import DenunciaRutas from './denuncia.routes.js';
import EspecializacionRutas from './especializacion.routes.js';
import LocalidadRutas from './localidad.routes.js';
import LogRutas from './log.routes.js';
import ModalidadRutas from './modalidad.routes.js';
import MovilidadRutas from './movilidad.routes.js';
import RolRutas from './rol.routes.js';
import SubmodalidadRutas from './submodalidad.routes.js';
import TipoArmaRutas from './tipoArma.routes.js';
import TipoDelitoRutas from './tipoDelito.routes.js';
import UbicacionRutas from './ubicacion.routes.js';
import UnidadRegionalRutas from './unidadRegional.routes.js';
import UsuarioRutas from './usuario.routes.js';
import ObjetoIARutas from './objetoIa.routes.js'
import verifyToken from '../middleware/jwt.js';
import VerifyToken from '../controllers/verifytoken.controller.js';
import Working from './working.routes.js'
import Scrap from './scrap.routes.js'
import express from 'express';

const router = express.Router();
router.use('/working', Working);
router.use('/autor', verifyToken, AutorRutas);
router.use('/comisaria', verifyToken, ComisariaRutas);
router.use('/departamento', verifyToken, DepartamentoRutas);
router.use('/denuncia', verifyToken, DenunciaRutas);
router.use('/especializacion', verifyToken, EspecializacionRutas);
router.use('/localidad', verifyToken, LocalidadRutas);
router.use('/log', verifyToken, LogRutas);
router.use('/modalidad', verifyToken, ModalidadRutas);
router.use('/movilidad', verifyToken, MovilidadRutas);
router.use('/rol', verifyToken, RolRutas);
router.use('/submodalidad', verifyToken, SubmodalidadRutas);
router.use('/tipoArma', verifyToken, TipoArmaRutas);
router.use('/tipoDelito', verifyToken, TipoDelitoRutas);
router.use('/ubicacion', verifyToken, UbicacionRutas);
router.use('/unidadRegional', verifyToken, UnidadRegionalRutas);
router.use('/objetoIA', verifyToken, ObjetoIARutas)
router.use('/usuario', UsuarioRutas);
router.use('/scrap', Scrap)
router.get('/verifyToken', verifyToken, VerifyToken);


export default router;