const router = require('express').Router()
import { CategoryController } from '../controllers'

router.get('/', CategoryController.getCategories)
router.get('/:id', CategoryController.getCategory)
router.post('/', CategoryController.createCategory)
router.put('/', CategoryController.updateCategory)

export default router
