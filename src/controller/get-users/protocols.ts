import { User } from '../../model/user';

export interface IGetUsersRepository {
	getUsers(): Promise<User[]>;
}
