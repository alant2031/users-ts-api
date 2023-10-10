import { IGetUsersRepository } from '../../controller/get-users/protocols';
import { MongoClient } from '../../database/mongo';
import { User } from '../../model/user';
import { MongoUser } from '../mongo-protocols';

export class MongoGetUsersRepository implements IGetUsersRepository {
	async getUsers(): Promise<User[]> {
		const users = await MongoClient.db
			.collection<MongoUser>('users')
			.find({})
			.toArray();
		return users.map(({ _id, ...rest }) => ({
			...rest,
			id: _id.toHexString(),
		}));
	}
}
