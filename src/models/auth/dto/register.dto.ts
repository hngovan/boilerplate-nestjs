import { PartialType } from '@nestjs/swagger'
import { CreateUserDto } from 'src/models/user/dto/create-user.dto'

export class RegisterDto extends PartialType(CreateUserDto) {}
