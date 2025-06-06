import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { join } from 'path'
import { AppModule } from './app.module'
import { ValidationError } from 'class-validator'
import { ERRORS_DICTIONARY } from './constraints/error-dictionary.constraint'
import { configSwagger } from './configs/api-docs'

async function bootstrap() {
  const logger = new Logger(bootstrap.name)
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config_service = app.get(ConfigService)
  const port = config_service.get<number>('PORT', 3000)

  configSwagger(app)
  app.useStaticAssets(join(__dirname, './served'))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          message: ERRORS_DICTIONARY.VALIDATION_ERROR,
          details: errors.map(error => (error.constraints ? Object.values(error.constraints) : [])).flat()
        })
    })
  )

  await app.listen(port, () => logger.log(`Application running on port ${port}`))
}
void bootstrap()
