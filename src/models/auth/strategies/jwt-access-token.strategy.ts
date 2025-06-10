import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from '../interfaces/token.interface'
import { access_token_public_key } from 'src/constraints/jwt.constraint'
import { UsersService } from 'src/models/user/user.service'

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: access_token_public_key
    })
  }

  validate(payload: TokenPayload) {
    return { payload }
  }
}
