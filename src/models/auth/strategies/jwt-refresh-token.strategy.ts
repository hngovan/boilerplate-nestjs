import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthService } from '../auth.service'
import { TokenPayload } from '../interfaces/token.interface'
import { refresh_token_public_key } from 'src/constraints/jwt.constraint'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh_token') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refresh_token_public_key,
      passReqToCallback: true
    })
  }

  async validate(request: Request, payload: TokenPayload) {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : undefined
    if (!token) {
      throw new Error('Refresh token not found in authorization header')
    }
    return await this.authService.getUserIfRefreshTokenMatched(payload.user_id, token)
  }
}
