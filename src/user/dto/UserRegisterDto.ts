import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Field "email" is incorrect' })
	email: string;

	@IsString({ message: 'Field "name" is required' })
	name: string;

	@IsString({ message: 'Field "password" is required' })
	password: string;
}
