import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception instanceof HttpException ? exception.getStatus() : 500
      const exceptionResponse = exception.getResponse()
      const error = typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse

      return response.status(status).json({
        statusCode: status,
        ...error
      })
    }

    if (exception instanceof QueryFailedError) {
      this.logger.error(`Database error: ${exception.message}`, exception.stack)

      return response.status(500).json({
        statusCode: 500,
        message: 'Database operation failed',
        error: 'Internal Server Error'
      })
    }

    this.logger.error(`Unexpected error: ${exception instanceof Error ? exception.message : 'Unknown error'}`)

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error'
    })
  }
}
