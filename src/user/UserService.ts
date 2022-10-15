import { inject, injectable } from 'inversify';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserEntity } from './UserEntity';
import { UserLoginDto } from './dto/UserLoginDto';
import { TYPES } from '../types';
import { IConfigService } from '../config/ConfigService';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserEntity | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

		// checks on exists

		return null;
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		return true;
	}
}
