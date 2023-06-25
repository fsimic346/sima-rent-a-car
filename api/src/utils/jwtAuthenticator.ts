import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../model/user.model'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import UserService from '../service/user.service'

const userService = container.resolve(UserService)
const jwtKey = config.get<string>('jwtKey')

export interface CustomRequest extends Request {
  username: string
}
interface UsernameJwtPayload extends JwtPayload {
  username: string
}

// refresh token bi bio idealan, al sta sad nek ostane ovako
export function generateAccessToken(user: User): string {
  return jwt.sign({ username: user.username }, jwtKey, { expiresIn: '7d' })
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: any,
) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.sendStatus(401)
    }

    const decodedToken = (await jwt.verify(token, jwtKey)) as UsernameJwtPayload
    const authenticatedUser = userService.getByUsername(decodedToken.username)
    if (!authenticatedUser) {
      return res.sendStatus(401)
    }

    ;(req as CustomRequest).username = decodedToken.username
    next()
  } catch (err) {
    res.sendStatus(401)
  }
}

export async function notAuthenticated(req: Request, res: Response, next: any) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      next()
      return
    }

    const decodedToken = (await jwt.verify(token, jwtKey)) as UsernameJwtPayload
    const authenticatedUser = userService.getByUsername(decodedToken.username)
    if (!authenticatedUser) {
      next()
      return
    }

    res.sendStatus(400)
  } catch (err) {
    res.sendStatus(400)
  }
}
