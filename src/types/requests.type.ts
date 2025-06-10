import { User } from 'src/models/user/entities/user.entity'
import { Request } from 'express'

export interface RequestWithUser extends Request {
  user: User
}
