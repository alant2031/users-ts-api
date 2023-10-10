import { User } from '../../model/user';

export interface IUpdateUserParams {
	firstName?: string;
	lastName?: string;
}

export interface IUpdateUserRepository {
	updateUser(id: string, params: IUpdateUserParams): Promise<User>;
}
