import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { LoginDto } from './dto/login.dto'
import { User } from '../user/entities/user.entity'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto,
    examples: {
      example: {
        value: {
          email: 'user@example.com',
          password: '123456'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user)
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }
}
