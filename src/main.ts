import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configSwagger } from './configs/api-docs'
import { join } from 'path'

async function bootstrap() {
  const logger = new Logger(bootstrap.name)
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config_service = app.get(ConfigService)
  const port = config_service.get<number>('PORT', 3000)
  const prefix = config_service.get<string>('GLOBAL_PREFIX') || 'api/v1'
  configSwagger(app)
  app.setGlobalPrefix(prefix)
  app.useStaticAssets(join(__dirname, './served'))

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )
  await app.listen(port, () => logger.log(`Application running on port ${port}`))
}
void bootstrap()
