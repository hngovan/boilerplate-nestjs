import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../user/dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint'
import { TokenPayload } from './interfaces/token.interface'
import { access_token_private_key, refresh_token_private_key } from 'src/constraints/jwt.constraint'
import { ConfigService } from '@nestjs/config'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  private BCRYPT_SALT_ROUNDS = 11
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const hashed_password = await bcrypt.hash(createUserDto.password, this.BCRYPT_SALT_ROUNDS)

    const user = await this.userService.create({
      ...createUserDto,
      username: `${createUserDto.email.split('@')[0]}${Math.floor(10 + Math.random() * (999 - 10))}`,
      password: hashed_password
    })

    const refresh_token = this.generateRefreshToken({
      user_id: user.id
    })

    await this.storeRefreshToken(user.id, refresh_token)
    return {
      access_token: this.generateAccessToken({
        user_id: user.id
      }),
      refresh_token
    }
  }

  async signIn(user_id: string): Promise<{
    access_token: string
    refresh_token: string
  }> {
    const access_token = this.generateAccessToken({
      user_id
    })
    const refresh_token = this.generateRefreshToken({
      user_id
    })

    await this.storeRefreshToken(user_id, refresh_token)
    return {
      access_token,
      refresh_token
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email)

    if (!user) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
        details: 'Wrong credentials!!'
      })
    }
    await this.verifyPlainContentWithHashedContent(password, user.password)
    return user
  }

  private async verifyPlainContentWithHashedContent(plain_text: string, hashed_text: string) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text)
    if (!is_matching) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.CONTENT_NOT_MATCH,
        details: 'Content not match!!'
      })
    }
  }

  async getUserIfRefreshTokenMatched(user_id: string, refresh_token: string): Promise<User> {
    const user = await this.userService.findOneById(user_id)
    if (!user) {
      throw new UnauthorizedException({
        message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
        details: 'Unauthorized'
      })
    }
    if (!user.currentRefreshToken) {
      throw new UnauthorizedException({
        message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
        details: 'No refresh token found'
      })
    }
    await this.verifyPlainContentWithHashedContent(refresh_token, user.currentRefreshToken)
    return user
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    })
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    })
  }

  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    const hashed_token = await bcrypt.hash(token, this.BCRYPT_SALT_ROUNDS)
    await this.userService.setCurrentRefreshToken(user_id, hashed_token)
  }
}
