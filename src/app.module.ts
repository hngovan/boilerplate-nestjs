import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { database_config } from './configs/configuration.config'
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        PORT: Joi.number().port().required(),
        DATABASE_PORT: Joi.number().port().required(),
        DATABASE_USERNAME: Joi.string().min(4).required(),
        DATABASE_PASSWORD: Joi.string().min(4).required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_URI: Joi.string().required()
      }),
      validationOptions: { abortEarly: false },
      isGlobal: true,
      load: [database_config],
      cache: true,
      expandVariables: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
