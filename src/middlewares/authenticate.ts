import { NextFunction, Request, Response } from 'express'
import session from '../config/session'
import { internalServerError } from '../helpers/responses'

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const { authToken } = req.cookies
    if (authToken) req.me = await session.get(authToken)

    next()
  } catch (error) {
    internalServerError(req, res, error)
  }
}

export default authenticate
