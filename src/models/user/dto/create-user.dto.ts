import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  username: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}
