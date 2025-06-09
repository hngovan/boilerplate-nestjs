import { OmitType } from '@nestjs/swagger'
import { CreateUserDto } from 'src/models/user/dto/create-user.dto'

export class LoginDto extends OmitType(CreateUserDto, ['username']) {}
