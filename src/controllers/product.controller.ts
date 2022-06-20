import { Request, Response } from 'express'
import { internalServerError, missingRequired, NOT_FOUND } from '../helpers/responses'
import ProductService from '../services/product.service'
import Product from '../types/product'

/**
 * @swagger
 * components:
 *   product:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: Shirts
 *       category_id:
 *         type: string
 *         example: 1234
 *       description:
 *         type: string
 *         example: My awesome description
 *       price:
 *         type: number
 *         example: 10,99
 *       stock:
 *         type: number
 *         example: 24
 *       image:
 *         type: string
 *         example: www.url-to-image.com
 *
 *   productResponse:
 *     type: object
 *     $ref: '#/components/product'
 *
 *   productsResponse:
 *     type: array
 *     items:
 *       $ref: '#/components/product'
 */
class ProductController {
  /**
   * @swagger
   * /api/products:
   *   get:
   *     tags: [Products]
   *     summary: Get all products
   *
   *     responses:
   *       200:
   *         description: products array
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/productsResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.find()
      if (!products) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(products)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/products/category/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get product by category_id
   *
   *     responses:
   *       200:
   *         description: Product object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/productResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { category_id } = req.params
      const products = await ProductService.findByCategoryId({ category_id })
      if (!products) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(products)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get product by ID
   *
   *     responses:
   *       200:
   *         description: Product object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/productResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const ERROR = missingRequired({ id })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const product: Product = await ProductService.findOne({ id })
      if (!product) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(product)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/products:
   *   post:
   *     tags: [Products]
   *     summary: Create a product
   *
   *     requestBody:
   *       description: Product data
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               category_id:
   *                 type: string
   *               description:
   *                 type: string
   *               stock:
   *                 type: number
   *               price:
   *                 type: number
   *               image:
   *                 type: string
   *
   *             example:
   *               name: Nike Airmax
   *               category_id: 123
   *               description: Size 43
   *               stock: 50
   *               price: 120
   *               image: url
   *
   *
   *     responses:
   *       200:
   *         description: Product object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/productResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, description, category_id, price, stock, image } = req.body
      const ERROR = missingRequired({ name, description, category_id, price, stock })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const products: Product = await ProductService.create({
        name,
        description,
        category_id,
        price,
        stock,
        image,
      })
      if (!products) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(products)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/products:
   *   put:
   *     tags: [Products]
   *     summary: Update a product
   *
   *     requestBody:
   *       description: Product data
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               category_id:
   *                 type: string
   *               description:
   *                 type: string
   *               stock:
   *                 type: number
   *               price:
   *                 type: number
   *               image:
   *                 type: string
   *
   *             example:
   *               name: Nike Airmax
   *               category_id: 123
   *               description: Size 43
   *               stock: 50
   *               price: 120
   *               image: url
   *
   *     responses:
   *       200:
   *         description: Product object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/productResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id, name, description, category_id, price, stock, image } = req.body
      const ERROR = missingRequired({ id })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const products: Product = await ProductService.update({
        name,
        description,
        category_id,
        price,
        stock,
        image,
        id,
      })
      if (!products) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(products)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }
}

export default ProductController
