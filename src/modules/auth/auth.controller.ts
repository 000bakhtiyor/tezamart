import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/metadatas/public.metadata';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/response/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ReSendEmailDto } from './dto/re-send-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    operationId: 'login',
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT access token.',
  })
  @ApiResponse({
    type: LoginResponseDto  
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @ApiOperation({
    operationId: 'register',
    summary: 'User registration',
    description: 'Registers a new user',
  })
  @ApiResponse({
    type: LoginResponseDto  
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @ApiOperation({
    operationId: 'verifyEmail',
    summary: 'Verify user email',
    description: 'Verifies a user\'s email using an OTP code.',
  })
  @ApiResponse({
    description: 'Email verified successfully'  
  })
  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('resend-otp')
  @ApiOperation({
    operationId: 'resendOtp',
    summary: 'Resend OTP code',
    description: 'Resends the OTP code to the user\'s email address.',
  })
  @ApiResponse({
    description: 'OTP code resent successfully'  
  })
  async resendOtp(@Body() dto: ReSendEmailDto) {
    return this.authService.resendOtp(dto.email);
  }

}
