import { IsString, IsInt, IsNotEmpty, IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString({message: 'Username must be a string'})
    @IsNotEmpty({message: 'Username is required'})
    readonly username: string;

    @IsEmail({}, {message: 'Invalid email format'})
    @IsNotEmpty({message: 'Email is required'})
    readonly email: string;

    @IsString({message: 'Password must be a string'})
    @IsNotEmpty({message: 'Password is required'})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: 'Password must be at least 8 characters long and contain both letters and numbers',
      })
    readonly password: string;

    @IsString({message: 'Role must be a string'})
    @IsNotEmpty({ message: 'Role is required' })
    readonly role: string;

    @IsString({message: 'Status must be a string'})
    @IsOptional()
    status?: string = 'inactive';

}