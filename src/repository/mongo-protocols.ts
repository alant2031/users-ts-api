import { User } from '../model/user';

export type MongoUser = Omit<User, 'id'>;
