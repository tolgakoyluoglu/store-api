const router = require('express').Router()
import { ProductController } from '../controllers'

router.get('/', ProductController.getProducts)
router.get('/:id', ProductController.getProduct)
router.get('/category/:category_id', ProductController.getProductsByCategory)
router.post('/', ProductController.createProduct)
router.put('/', ProductController.updateProduct)

export default router
