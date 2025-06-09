import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { BCRYPT_SALT_ROUNDS } from 'src/shared/security.constants'
import { IsEmail, IsNotEmpty } from 'class-validator'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Column()
  username: string

  @Column()
  @IsNotEmpty()
  password: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS)
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password)
  }
}
