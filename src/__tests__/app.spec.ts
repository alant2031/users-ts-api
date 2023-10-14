/* eslint-disable no-prototype-builtins */
import { MongoUser } from 'repository/mongo-protocols';
import { assert } from 'chai';
import request from 'supertest';
import { MongoClient } from '../database/mongo';
import { server } from '../server';

const resetDBCollection = async () => {
	const db = MongoClient.db;
	try {
		await db.collection('users').drop();
	} catch (err) {
		/* empty */
	}
};
describe('Test /users POST METHOD', () => {
	before(async () => {
		await resetDBCollection();
	});
	it('Test Status CREATED', async () => {
		const app = await server();
		const resp = await request(app)
			.post('/users')
			.send({
				firstName: 'John',
				lastName: 'Smith',
				email: 'test@mail.com',
				password: 'abc123',
			} as MongoUser);
		assert.equal(resp.status, 201);
	});
	it('Test Response Body Created', async () => {
		const app = await server();
		const bodyReq: MongoUser = {
			firstName: 'Carlos',
			lastName: 'Silva',
			email: 'carlos@mail.com',
			password: '111111',
		};
		const resp = await request(app).post('/users').send(bodyReq);
		assert.isTrue(resp.body.hasOwnProperty('id'));
		assert.equal(resp.body.firstName, bodyReq.firstName);
		assert.equal(resp.body.lastName, bodyReq.lastName);
		assert.equal(resp.body.email, bodyReq.email);
		assert.equal(resp.body.password, bodyReq.password);
	});
	it('Test Empty Request', async () => {
		const app = await server();

		const resp = await request(app).post('/users').send({});
		assert.equal(resp.status, 400);
		assert.equal(resp.body, 'Some required fields are missing');
	});
	it('Test Invalid Email', async () => {
		const app = await server();
		const bodyReq: MongoUser = {
			firstName: 'Test',
			lastName: 'Test',
			email: 'invalid_email',
			password: '111111',
		};
		const resp = await request(app).post('/users').send(bodyReq);
		assert.equal(resp.status, 400);
		assert.equal(resp.body, 'Email is invalid');
	});
	it('Test Email is Unique', async () => {
		const app = await server();
		const resp = await request(app)
			.post('/users')
			.send({
				firstName: 'James',
				lastName: 'Carter',
				email: 'test@mail.com',
				password: 'qwerty',
			} as MongoUser);

		assert.equal(resp.status, 409);
		assert.equal(resp.body, 'Email already exists');
	});
});

describe('Test /users GET METHOD', () => {
	before(async () => {
		await resetDBCollection();
	});
	it('Test List All Users', async () => {
		const app = await server();
		const emailList = ['test1@gm.com', 'test2@gm.com', 'test3@gm.com'];
		const requests = emailList.map((email) => {
			const resp = request(app)
				.post('/users')
				.send({
					firstName: 'Test',
					lastName: 'Test',
					email: email,
					password: '222222',
				} as MongoUser);
			return resp;
		});
		const results = await Promise.all(requests);
		const resp = await request(app).get('/users');
		assert.equal(resp.status, 200);
		assert.equal(results.length, resp.body.length);
	});
});

describe('Test /users/id PATCH METHOD', () => {
	beforeEach(async () => {
		await resetDBCollection();
	});

	const reqBody: MongoUser = {
		firstName: 'Gary',
		lastName: 'Cole',
		email: 'gary@mail.com',
		password: '454545',
	};
	const newLastName = 'Schmidt';
	const invalidID = '65255947678f76d1d7e786c4';

	it('Test Response Body Updated', async () => {
		const app = await server();
		const respCreated = await request(app).post('/users').send(reqBody);
		const respUpdated = await request(app)
			.patch('/users/' + respCreated.body.id)
			.send({ lastName: newLastName } as Omit<MongoUser, 'email' | 'password'>);
		assert.equal(respUpdated.status, 200);
		assert.equal(respUpdated.body.email, reqBody.email);
		assert.equal(respUpdated.body.lastName, newLastName);
	});

	it('Test Empty Request', async () => {
		const app = await server();
		const respCreated = await request(app).post('/users').send(reqBody);
		const resp = await request(app)
			.patch('/users/' + respCreated.body.id)
			.send({});
		assert.equal(resp.status, 400);
		assert.equal(resp.body, 'Some required fields are missing');
	});

	it('Test Invalid Params', async () => {
		const app = await server();
		const respCreated = await request(app).post('/users').send(reqBody);
		const resp = await request(app)
			.patch('/users/' + respCreated.body.id)
			.send({ email: 'josh@mail.com' } as MongoUser);

		assert.equal(resp.status, 400);
		assert.equal(resp.body, 'Field not allowed');
	});
	it('Test Invalid ID', async () => {
		const app = await server();
		const resp = await request(app)
			.patch('/users/' + invalidID)
			.send({ lastName: newLastName } as MongoUser);

		assert.equal(resp.status, 500);
	});
	it('Test Empty ID', async () => {
		const app = await server();
		const resp = await request(app).patch('/users');

		assert.equal(resp.status, 404);
	});
});

describe('Test /users/id DELETE METHOD', () => {
	beforeEach(async () => {
		await resetDBCollection();
	});

	const reqBody: MongoUser = {
		firstName: 'Gary',
		lastName: 'Cole',
		email: 'gary@mail.com',
		password: '454545',
	};
	const invalidID = '65255947678f76d1d7e786c4';

	it('Test Status NO CONTENT', async () => {
		const app = await server();
		const respCreated = await request(app).post('/users').send(reqBody);
		const respDeleted = await request(app).delete(
			'/users/' + respCreated.body.id,
		);

		assert.equal(respDeleted.status, 204);
	});
	it('Test Invalid ID', async () => {
		const app = await server();
		const resp = await request(app).delete('/users/' + invalidID);

		assert.equal(resp.status, 500);
	});
	it('Test Empty ID', async () => {
		const app = await server();
		const resp = await request(app).delete('/users');

		assert.equal(resp.status, 404);
	});
});
