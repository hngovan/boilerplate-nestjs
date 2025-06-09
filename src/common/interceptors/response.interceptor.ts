// src/interceptors/response.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  statusCode: number
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse<import('express').Response>()

    return next.handle().pipe(
      map((data: T) => ({
        statusCode: response.statusCode,
        data
      }))
    )
  }
}
