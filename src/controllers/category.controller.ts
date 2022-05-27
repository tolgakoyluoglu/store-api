import { Request, Response } from 'express'
import { nestCategories } from '../helpers'
import { internalServerError, missingRequired, NOT_FOUND } from '../helpers/responses'
import CategoryService from '../services/category.service'
import Category from '../types/category'

/**
 * @swagger
 * components:
 *   category:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: Shirts
 *       parent_id:
 *         type: string
 *         example: 1234
 *
 *   categoryResponse:
 *     type: object
 *     $ref: '#/components/category'
 *
 *   categoriesResponse:
 *     type: array
 *     items:
 *       $ref: '#/components/category'
 */
class CategoryController {
  /**
   * @swagger
   * /api/categories:
   *   get:
   *     tags: [Categories]
   *     summary: Get all categories
   *
   *     responses:
   *       200:
   *         description: Categories array
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/categoriesResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.find()

      // Structure the data with nested category children
      const result: Category[] = nestCategories(categories)
      if (!result) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(result)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Get category by ID
   *
   *     responses:
   *       200:
   *         description: Category object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/categoryResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async getCategory(req: Request, res: Response) {
    try {
      const { id } = req.params
      const ERROR = missingRequired({ id })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const category: Category = await CategoryService.findOne({ id })
      if (!category) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(category)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     tags: [Categories]
   *     summary: Create a category
   *
   *     requestBody:
   *       description: Category data. Assign parent_id to make nested categories or null to assign top level category
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               parent_id:
   *                 type: string | null
   *
   *             example:
   *               name: Shoes
   *               parent_id: null
   *
   *     responses:
   *       200:
   *         description: Category object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/categoryResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async createCategory(req: Request, res: Response) {
    try {
      const { name, parent_id } = req.body
      const ERROR = missingRequired({ name })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const category: Category = await CategoryService.create({ name, parent_id })
      if (!category) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(category)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/categories:
   *   put:
   *     tags: [Categories]
   *     summary: Update a category
   *
   *     requestBody:
   *       description: Category data. Assign parent_id to make nested categories or null to assign top level category
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               parent_id:
   *                 type: string | null
   *
   *             example:
   *               name: Shirts
   *               parent_id: null
   *
   *     responses:
   *       200:
   *         description: Category object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/categoryResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async updateCategory(req: Request, res: Response) {
    try {
      const { id, name, parent_id } = req.body
      const ERROR = missingRequired({ id })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const category: Category = await CategoryService.update({ id, name, parent_id })
      if (!category) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      res.json(category)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }
}

export default CategoryController
