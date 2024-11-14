import express from 'express'
import {getScrapping} from '../controllers/scrapping.controller.js'

const router = express.Router()
router.post('/scrapping', getScrapping)

export default router;