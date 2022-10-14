import shortid from 'shortid'
import debug from 'debug'

import { CreateUserDto } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { PutUserDto } from '../dto/put.user.dto'

const log: debug.IDebugger = debug('app:in-memory-dao')

class UsersDao {
  users: Array<CreateUserDto> = []

  constructor() {
    log('Created new instance of UsersDao')
  }

  async addUser(user: CreateUserDto) {
    user = {
      ...user,
      id: shortid.generate(),
    }

    this.users.push(user)

    return user
  }

  async getUsers() {
    return this.users
  }

  async getUserById(userId: string) {
    return this.users.find((user: { id: string }) => user.id === userId)
  }

  async getUserByEmail(email: string) {
    const objIndex = this.users.findIndex(
      (obj: { email: string }) => obj.email === email
    )

    let currentUser = this.users[objIndex]

    if (currentUser) {
      return currentUser
    }

    return null
  }

  async putUserById(userId: string, user: PutUserDto) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    )

    this.users.splice(objIndex, 1, user)

    return user
  }

  async patchUserById(userId: string, user: PatchUserDto) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    )

    let currentUser = this.users[objIndex]

    const allowedPatchFields = [
      'password',
      'firstName',
      'lastName',
      'permissionLevel',
    ]

    for (let field of allowedPatchFields) {
      if (field in user) {
        // @ts-ignore
        currentUser[field] = user[field]
      }
    }

    this.users.splice(objIndex, 1, currentUser)

    return currentUser
  }

  async removeUserById(userId: string) {
    const objIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId
    )

    this.users.splice(objIndex, 1)
  }
}

export default new UsersDao()
