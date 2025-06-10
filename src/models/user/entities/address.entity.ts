import { Exclude } from 'class-transformer'
import { Column, Entity } from 'typeorm'
import { IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator'

@Entity('addresses')
export class Address {
  @Column({
    type: 'varchar',
    length: 120,
    nullable: true
  })
  @MinLength(2)
  @MaxLength(120)
  @IsOptional()
  street?: string

  @Column({
    type: 'varchar',
    length: 50
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  state: string

  @Column({
    type: 'varchar',
    length: 50
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  city: string

  @Column({
    type: 'int',
    nullable: true,
    name: 'postal_code'
  })
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  @Exclude()
  postalCode?: number

  @Column({
    type: 'varchar',
    length: 50
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  country: string
}
