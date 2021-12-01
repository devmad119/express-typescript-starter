import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, CheckAccountDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signUp(userData);

      res.status(201).json({ data: signUpUserData, message: 'Success to sign up!' });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountData: CheckAccountDto = req.body;
      const { token, findUser } = await this.authService.singIn(accountData);

      res.status(200).json({ data: findUser, token, message: 'Success to sign in!' });
    } catch (error) {
      next(error);
    }
  };

  public signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ message: 'Success to sign out!' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
