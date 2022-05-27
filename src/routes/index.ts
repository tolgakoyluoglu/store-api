const router = require('express').Router()
import customers from './customers'
import categories from './categories'
import products from './products'
import { Request, Response } from 'express'

router.get('/', (req: Request, res: Response) => {
  res.send('200 OK')
})

router.use('/api/customers', customers)
router.use('/api/categories', categories)
router.use('/api/products', products)

export default router
