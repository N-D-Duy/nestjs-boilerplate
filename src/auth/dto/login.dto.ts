import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, {message: 'Invalid email format'})
  @IsNotEmpty({message: 'Email is required'})
  email: string;

  @IsString({message: 'Password must be a string'})
  @IsNotEmpty({message: 'Password is required'})
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must be at least 8 characters long and contain both letters and numbers',
  })
  password: string;
}
