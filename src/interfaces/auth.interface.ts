import { IsEmail, IsString } from 'class-validator';

export interface DataStoredInToken {
  _id: string;
  email: string;
  userName: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}
