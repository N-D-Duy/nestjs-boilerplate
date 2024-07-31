import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsEmail, IsOptional, Matches, IsEnum } from 'class-validator';
import { Role } from 'src/shared/helpers/role.enum';
import { Status } from 'src/shared/helpers/status.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @ApiProperty()
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must be at least 8 characters long and contain both letters and numbers',
  })
  readonly password: string;

  @ApiProperty({enum: Role})
  @IsEnum(Role, { message: 'Role must be a valid enum value' })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  readonly role: string;

  @ApiProperty({enum: Status})
  @IsString({ message: 'Status must be a string' })
  @IsEnum(Status, { message: 'Status must be a valid enum value' })
  @IsOptional()
  status?: string = 'inactive';

}