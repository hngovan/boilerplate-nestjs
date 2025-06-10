import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../user/user.module'
import { LocalStrategy } from 'src/models/auth/strategies/local.strategy'
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy'
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
