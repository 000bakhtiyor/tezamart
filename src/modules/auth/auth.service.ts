import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const userIsValid = await this.usersService.userIsValid(username, password);
    if (!userIsValid) {
      throw new UnauthorizedException(
        "Foydalanuvchi topilmadi yoki noto'g'ri parol kiritildi",
      );
    }

    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException(
        "Foydalanuvchi topilmadi yoki noto'g'ri parol kiritildi",
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Foydalanuvchi faol emas');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Foydalanuvchi tasdiqlanmagan');
    }

    const payload = { sub: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, password, email } = registerDto;

    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new UnauthorizedException('Username allaqachon mavjud');
    }

    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new UnauthorizedException('Email allaqachon mavjud');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.sendMail(email, username, otpCode).catch((err) => {
      console.error("Email jo'natishda xato:", err);
      throw new NotFoundException("Email jo'natishda xato yuz berdi");
    });
    await this.cacheManager.set(`otp_${email}`, otpCode);
    const newUser = await this.usersService.create({
      username,
      password,
      email,
    });

    return newUser;
  }

  async verifyOtp(dto: VerifyEmailDto) {
    const cachedOtp = await this.cacheManager.get<string>(`otp_${dto.email}`);
    if (!cachedOtp) {
      throw new NotFoundException('OTP kodi topilmadi yoki muddati tugagan');
    }
    if (cachedOtp !== dto.otpCode) {
      throw new UnauthorizedException("Noto'g'ri OTP kodi");
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    await this.usersService.verifyUser(user.id);

    await this.cacheManager.del(`otp_${dto.email}`);

    return { message: 'Foydalanuvchi muvaffaqiyatli tasdiqlandi' };
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (user.isVerified) {
      throw new UnauthorizedException('Foydalanuvchi allaqachon tasdiqlangan');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Foydalanuvchi faol emas');
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.sendMail(email, user.username, otpCode).catch((err) => {
      console.error("Email jo'natishda xato:", err);
      throw new NotFoundException("Email jo'natishda xato yuz berdi");
    });

    await this.cacheManager.set(`otp_${email}`, otpCode);

    return { message: "OTP kodi muvaffaqiyatli qayta jo'natildi" };
  }

  async sendMail(to: string, username: string, otpCode: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Tezamart!',
      template: 'welcome',
      context: {
        name: username,
        otpCode,
        year: new Date().getFullYear(),
      },
    });
  }

  async me(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user;
  }
}
