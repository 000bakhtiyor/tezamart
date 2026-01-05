import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const exisitingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (exisitingUser) {
      throw new ConflictException('Ushbu username allaqachon mavjud');
    }

    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  async userIsValid(username: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: {
        password: true,
      }
    });
    if(!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);
    
    return isMatch;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async checkUserExistence(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return !!user;
  }

  async verifyUser(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { isVerified: true });
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
