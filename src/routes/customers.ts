const router = require('express').Router()
import { CustomerController } from '../controllers'
import authenticate from '../middlewares/authenticate'

router.post('/sign-in', CustomerController.signIn)
router.post('/sign-up', CustomerController.signUp)
router.get('/sign-out', authenticate, CustomerController.signOut)
router.get('/authenticate', authenticate, CustomerController.authenticateRoute)

export default router
