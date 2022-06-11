import {
  internalServerError,
  missingRequired,
  NOT_FOUND,
  EMAIL_EXISTS,
  EMAIL_PASSWORD_NOMATCH,
  UNAUTHORIZED,
} from '../helpers/responses'
import { uuidv4 } from '../helpers'
import session from '../config/session'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import Customer from '../types/customer'
import { CustomerService } from '../services'

const { NODE_ENV } = process.env
const salt = bcrypt.genSaltSync(10)
const cookieConfig = {
  httpOnly: true,
  secure: NODE_ENV !== 'development',
}

/**
 * @swagger
 * components:
 *   customer:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         example: john@email.com
 *
 *   customerResponse:
 *     type: object
 *     $ref: '#/components/customer'
 *
 *   customersResponse:
 *     type: array
 *     items:
 *       $ref: '#/components/customer'
 */
class CustomerController {
  /**
   * @swagger
   * /api/customers/sign-up:
   *   post:
   *     tags: [Customers]
   *     summary: Sign up
   *
   *     requestBody:
   *       description: The customer to create.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *             example:
   *               email: john@email.com
   *               password: '123456'
   *
   *     responses:
   *       200:
   *         description: Customer object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/Customer'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized request
   *
   */
  static async signUp(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const ERROR = missingRequired({ email, password })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      const emailExists: Customer = await CustomerService.findOne({ email })
      if (emailExists) return res.status(EMAIL_EXISTS.code).json(EMAIL_EXISTS)

      const hashedPassword = bcrypt.hashSync(password, salt)
      const customer: Customer = await CustomerService.create({
        email,
        password: hashedPassword,
      })

      res.json(customer)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/customers/sign-in:
   *   post:
   *     tags: [Customers]
   *     summary: Sign in
   *
   *     requestBody:
   *       description: Customer credentials.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *
   *             example:
   *               email: john@email.com
   *               password: '123456'
   *
   *     responses:
   *       200:
   *         description: Customer object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/customerResponse'
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: clientCookie=abcde12345; Path=/; HttpOnly
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized request
   *
   */
  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const ERROR = missingRequired({ email, password })
      if (ERROR) return res.status(ERROR.code).json(ERROR)

      let customer: Customer = await CustomerService.findOne({ email })
      if (!customer) return res.status(NOT_FOUND.code).json(NOT_FOUND)

      const match = await CustomerService.comparePassword(customer.password, password)
      if (!match) return res.status(EMAIL_PASSWORD_NOMATCH.code).json(EMAIL_PASSWORD_NOMATCH)

      const sessionData = { id: customer.id }
      const token = uuidv4()

      await session.set(token, sessionData)
      res.cookie('authToken', token, cookieConfig)
      const sessionTokens = [token].concat(customer.sessions)
      customer = await CustomerService.update({ id: customer.id, sessions: sessionTokens })

      res.json(customer)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/customers/authenticate:
   *   get:
   *     tags: [Customers]
   *     summary: Authenticate customer
   *
   *     responses:
   *       200:
   *         description: Customer object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/customerResponse'
   *       401:
   *         description: Unauthorized request
   *
   */
  static async authenticateRoute(req: Request, res: Response) {
    try {
      if (!req.me) return res.json(null)
      const { id } = req.me

      const customer: Customer = await CustomerService.findOne({ id })
      if (!customer) return res.status(UNAUTHORIZED.code).json(UNAUTHORIZED)

      // Don't leak sensitive data
      customer.sessions = []
      customer.password = ''

      res.json(customer)
    } catch (error) {
      internalServerError(req, res, error)
    }
  }

  /**
   * @swagger
   * /api/customers/sign-out:
   *   get:
   *     tags: [Customers]
   *     summary: Sign out
   *
   *     responses:
   *       204:
   *         description: No content
   *
   */
  static async signOut(req: Request, res: Response) {
    try {
      if (!req.me) return res.json(null)
      const { token } = req.cookies
      const { id } = req.me

      const customer = await CustomerService.findOne(id)
      if (customer) {
        let sessionTokens = customer.sessions
        sessionTokens = sessionTokens.filter((t: string) => t !== token)
        customer.sessions = sessionTokens
        await CustomerService.update({ id: customer.id, sessions: sessionTokens })
      }
      await session.del(token)
      res.clearCookie('authToken')

      res.status(204).end()
    } catch (error) {
      internalServerError(req, res, error)
    }
  }
}

export default CustomerController
