import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Field "email" is required' })
	email: string;

	@IsString({ message: 'Field "password" is required' })
	password: string;
}
