import express from 'express'
import usersService from '../services/users.service'
import debug from 'debug'

const log: debug.IDebugger = debug('app:users-middleware')

class UsersMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!req.body || !req.body.email || !req.body.password) {
      res.status(422).send({
        error: 'Missing required fields',
      })
    }

    next()
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email)

    if (user) res.status(409).send({ error: 'User email already exists' })

    next()
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email)

    if (user && user.id === req.params.userId) next()

    res.status(400).send({ error: 'Invalid email' })
  }

  validatePatchEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.email) {
      log('Validating email', req.body.email)

      this.validateSameEmailBelongToSameUser(req, res, next)
    }

    next()
  }

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await usersService.readById(req.params.userId)

    if (!user) {
      res.status(404).send({
        error: `User ${req.params.userId} not found`,
      })
    }

    next()
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId
    next()
  }
}

export default new UsersMiddleware()
