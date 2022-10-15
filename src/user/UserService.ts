import { inject, injectable } from 'inversify';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserEntity } from './UserEntity';
import { UserLoginDto } from './dto/UserLoginDto';
import { TYPES } from '../types';
import { IConfigService } from '../config/ConfigService';
import { IUserRepository } from './UserRepository';
import { UserModel } from '@prisma/client';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new UserEntity(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

		const foundUser = await this.userRepository.find(email);
		if (foundUser) {
			return null;
		}

		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const foundUser = await this.userRepository.find(email);

		if (!foundUser) {
			return false;
		}

		const newUser = new UserEntity(foundUser.email, foundUser.name, foundUser.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
