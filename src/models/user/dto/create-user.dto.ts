import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator'
import { CreateAddressDto } from './create-address.dto'
import { Type } from 'class-transformer'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  username: string

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string

  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto[]
}
