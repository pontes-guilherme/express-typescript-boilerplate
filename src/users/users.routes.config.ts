import { CommonRoutesConfig } from '../common/common.routes.config'
import express from 'express'
import usersController from './controllers/users.controller'
import usersMidleware from './middlewares/users.midleware'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UserRoutes')
  }

  configureRoutes() {
    this.app
      .route('/users')
      .get(usersController.listUsers)
      .post(
        usersMidleware.validateRequiredUserBodyFields,
        usersMidleware.validateSameEmailDoesntExist,
        usersController.createUser
      )

    this.app.param('userId', usersMidleware.extractUserId)

    this.app
      .route(`/users/:userId`)
      .all(usersMidleware.validateUserExists)
      .get(usersController.getUserById)
      .delete(usersController.removeUser)

    this.app.put(`/users/:userId`, [
      usersMidleware.validateRequiredUserBodyFields,
      usersMidleware.validateSameEmailBelongToSameUser,
      usersController.putUser,
    ])

    this.app.patch('/users/:userId', [
      usersMidleware.validatePatchEmail,
      usersController.patchUser,
    ])

    return this.app
  }
}
