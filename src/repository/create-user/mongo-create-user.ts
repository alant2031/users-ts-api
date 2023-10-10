import {
	ICreateUserParams,
	ICreateUserRepository,
} from '../../controller/create-user/protocols';
import { MongoClient } from '../../database/mongo';
import { User } from '../../model/user';
import { MongoUser } from '../mongo-protocols';

export class MongoCreateUserRepository implements ICreateUserRepository {
	async createUser(params: ICreateUserParams): Promise<User> {
		const { insertedId } = await MongoClient.db
			.collection('users')
			.insertOne(params);

		const user = await MongoClient.db
			.collection<MongoUser>('users')
			.findOne({ _id: insertedId });

		if (!user) {
			throw new Error('User not created');
		}

		const { _id, ...rest } = user;

		return { id: _id.toHexString(), ...rest };
	}
	async emailExists(email: ICreateUserParams['email']): Promise<boolean> {
		const userEmail = await MongoClient.db
			.collection<MongoUser>('users')
			.findOne({ email: email });
		return !!userEmail;
	}
}
