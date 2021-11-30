import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public userName: string;
}

export class CheckAccountDto {
  @IsString()
  public account: string;

  @IsString()
  public password: string;
}
