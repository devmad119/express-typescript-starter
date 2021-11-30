import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto, CheckAccountDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty, validateEmail } from '@utils/util';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ $or: [{ email: userData.email }, { userName: userData.userName }] });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} or userName ${userData.userName} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(accountData: CheckAccountDto): Promise<{ token: string; findUser: User }> {
    if (isEmpty(accountData)) throw new HttpException(400, "You're not accountData");

    let findUser: User = {
      _id: '',
      email: '',
      password: '',
    };

    if (validateEmail(accountData.account)) findUser = await this.users.findOne({ email: accountData.account });
    else findUser = await this.users.findOne({ userName: accountData.account });

    if (!findUser) throw new HttpException(409, `You're account ${accountData.account} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(accountData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);

    return { token: tokenData.token, findUser };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
