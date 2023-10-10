import { MongoClient as Mongo, Db, MongoClientOptions } from 'mongodb';

export const MongoClient = {
	client: undefined as unknown as Mongo,
	db: undefined as unknown as Db,

	async connect(): Promise<void> {
		try {
			const url = process.env.MONGODB_URL!;
			const username = process.env.MONGODB_USERNAME;
			const password = process.env.MONGODB_PASSWORD;

			const clientOptions: MongoClientOptions = {
				auth: { username, password },
			};

			const client = new Mongo(url, clientOptions);
			await client.connect(); // Connect to MongoDB

			const db = client.db('sysdb');

			this.client = client;
			this.db = db;
			console.log('Mongodb connection is active');
		} catch (error) {
			// Handle connection errors here
			console.error('MongoDB connection error:', error);
			throw new Error('Failed to connect to MongoDB');
		}
	},
};
