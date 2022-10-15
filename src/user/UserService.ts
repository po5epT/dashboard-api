import { injectable } from 'inversify';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserEntity } from './UserEntity';
import { UserLoginDto } from './dto/UserLoginDto';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserEntity | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name);
		await newUser.setPassword(password);

		// checks on exists

		return null;
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		return true;
	}
}
