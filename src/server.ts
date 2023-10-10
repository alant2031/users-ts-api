import express from 'express';
import { config } from 'dotenv';
import { GetUsersController } from './controller/get-users/get-users';
import { MongoGetUsersRepository } from './repository/get-users/mongo-get-users';
import { MongoClient } from './database/mongo';
import { MongoCreateUserRepository } from './repository/create-user/mongo-create-user';
import { CreateUserController } from './controller/create-user/create-user';
import { MongoUpdateUserRepository } from './repository/update-user/mongo-update-user';
import { UpdateUserController } from './controller/update-user/update-user';
import { MongoDeleteUserRepository } from './repository/delete-user/mongo-delete-user';
import { DeleteUserController } from './controller/delete-user/delete-user';

config();

const app = express();

export const server = async () => {
	app.use(express.json());
	await MongoClient.connect();

	app.get('/users', async (req, res) => {
		const mongoGetUsersRepository = new MongoGetUsersRepository();
		const getUsersController = new GetUsersController(
			mongoGetUsersRepository,
		);
		const { body, statusCode } = await getUsersController.handle();

		res.status(statusCode).json(body);
	});

	app.post('/users', async (req, res) => {
		const mongoCreateUserRepository = new MongoCreateUserRepository();
		const createUserController = new CreateUserController(
			mongoCreateUserRepository,
		);
		const { body, statusCode } = await createUserController.handle({
			body: req.body,
		});

		res.status(statusCode).json(body);
	});

	app.patch('/users/:id', async (req, res) => {
		const mongoUpdateRepository = new MongoUpdateUserRepository();
		const updateUserController = new UpdateUserController(
			mongoUpdateRepository,
		);
		const { body, statusCode } = await updateUserController.handle({
			body: req.body,
			params: req.params,
		});
		res.status(statusCode).json(body);
	});
	app.delete('/users/:id', async (req, res) => {
		const mongoDeleteUserRepository = new MongoDeleteUserRepository();
		const deleteUserController = new DeleteUserController(
			mongoDeleteUserRepository,
		);

		const { body, statusCode } = await deleteUserController.handle({
			params: req.params,
		});

		res.status(statusCode).json(body);
	});
	return app;
};
