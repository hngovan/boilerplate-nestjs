import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BCRYPT_SALT_ROUNDS } from 'src/shared/security.constants'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    })

    if (existingUser) {
      throw new BadRequestException('Account with this email already exists.')
    }

    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email']
    })
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`)
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, BCRYPT_SALT_ROUNDS)
    }

    return this.userRepository.save(user)
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    await this.userRepository.remove(user)

    return { message: `User with ID ${id} removed successfully` }
  }
}
