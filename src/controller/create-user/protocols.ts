import { User } from '../../model/user';

export interface ICreateUserParams {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface ICreateUserRepository {
	createUser(params: ICreateUserParams): Promise<User>;
	emailExists(email: ICreateUserParams['email']): Promise<boolean>;
}
