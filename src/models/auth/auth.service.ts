import { Injectable } from '@nestjs/common'
import { UsersService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUserByEmail(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email)
    if (user && (await user.comparePassword(pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user
      return result
    }
    return null
  }

  login(user: User): { access_token: string } {
    const payload = {
      email: user.email,
      sub: user.id
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async register(createUserDto: RegisterDto) {
    return await this.userService.create(createUserDto)
  }
}
