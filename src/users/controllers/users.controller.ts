import express from 'express'
import argon2 from 'argon2'
import debug from 'debug'

import usersService from '../services/users.service'

const log: debug.IDebugger = debug('app:users-controller')

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0)

    res.status(200).send(users)
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id)

    res.status(200).send(user)
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password)

    const user = await usersService.create(req.body)

    res.status(201).send(user)
  }

  async patchUser(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password)
    }

    const user = await usersService.patchById(req.body.id, req.body)

    res.status(200).send(user)
  }

  async putUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password)

    const user = await usersService.putById(req.body.id, req.body)

    res.status(200).send(user)
  }

  async removeUser(req: express.Request, res: express.Response) {
    await usersService.deleteById(req.body.id)

    res.status(204).send()
  }
}

export default new UsersController()
