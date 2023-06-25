import Repository from './repository'
import { singleton } from 'tsyringe'
import fs from 'fs'

@singleton()
export default class UserRepository extends Repository {
  path = './data/user.json'

  constructor() {
    super()
    this.createStorage()
  }
}
