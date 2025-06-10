import { OmitType } from '@nestjs/swagger'
import { CreateUserDto } from 'src/models/user/dto/create-user.dto'

export class SignInDto extends OmitType(CreateUserDto, ['username', 'address']) {}
