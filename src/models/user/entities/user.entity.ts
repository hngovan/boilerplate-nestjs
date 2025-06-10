import { BeforeInsert, Column, Entity } from 'typeorm'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { BaseEntity } from 'src/common/entities/base.entity'
import { Exclude } from 'class-transformer'

export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Column()
  username: string

  @Column()
  @IsNotEmpty()
  password: string

  @Column({
    default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
  })
  avatar?: string

  @Column({
    name: 'current_refresh_token',
    nullable: true
  })
  @Exclude()
  currentRefreshToken?: string

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase()
  }
}
