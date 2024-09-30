import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  fullName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message: 'Password too weak (it must contain a number, a capital letter, a lowercase letter, and a special character)',
  })
  password: string;

  @IsString()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  address: string;

  @IsString()
  @Matches(/(buyer|seller)/, { message: 'Role must be either "buyer" or "seller"' })
  roleName: 'buyer' | 'seller';
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

