import { IsNotEmpty, IsNumberString, IsOptional, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateAddressDto {
  @IsOptional()
  @MinLength(2)
  @MaxLength(120)
  street?: string

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  state: string

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  city: string

  @IsOptional()
  @IsNumberString()
  @Matches(/^\d{5}$/, {
    message: 'postal_code must be 5 digits (eg: 70000)'
  })
  postal_code: number
}
