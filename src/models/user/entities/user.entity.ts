import { IUser } from '../interfaces/user.interface'
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { BCRYPT_SALT_ROUNDS } from 'src/shared/security.constants'
import { IsEmail, IsNotEmpty } from 'class-validator'

@Entity({ name: 'users' })
export class User implements IUser {
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase()
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS)
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password)
  }
}
