import * as Joi from 'joi'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './models/auth/auth.module'
import { UsersModule } from './models/user/user.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        PORT: Joi.number().port().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().port().required(),
        DATABASE_USER: Joi.string().min(4).required(),
        DATABASE_PASSWORD: Joi.string().min(4).required(),
        DATABASE_NAME: Joi.string().required()
      }),
      validationOptions: { abortEarly: false },
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'
    }),
    DatabaseModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}
