import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configSwagger } from './configs/api-docs'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const logger = new Logger(bootstrap.name)
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config_service = app.get(ConfigService)
  const port = config_service.get<number>('PORT', 3000)
  configSwagger(app)
  app.setGlobalPrefix('api/v1')

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )
  // Global interceptor for success responses
  app.useGlobalInterceptors(new ResponseInterceptor())
  // Global filter for error responses
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(port, () => logger.log(`Application running on port ${port}`))
}
void bootstrap()
