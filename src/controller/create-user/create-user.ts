import validator from 'validator';
import { User } from '../../model/user';
import { HttpResponse, HttpRequest, IController } from '../protocols';
import { ICreateUserParams, ICreateUserRepository } from './protocols';
import { badRequest, conflict, created, serverError } from '../helpers';

export class CreateUserController implements IController {
	constructor(private readonly createUserRepository: ICreateUserRepository) {}
	async handle(
		httpRequest: HttpRequest<ICreateUserParams>,
	): Promise<HttpResponse<User | string>> {
		try {
			const requiredFields = ['firstName', 'lastName', 'email', 'password'];

			for (const field of requiredFields) {
				if (!httpRequest?.body?.[field as keyof ICreateUserParams]?.length) {
					return badRequest('Some required fields are missing');
				}
			}
			const emailValid = validator.isEmail(httpRequest.body!.email);
			if (!emailValid) {
				return badRequest('Email is invalid');
			}
			const { body } = httpRequest;
			if (!body) {
				return badRequest('Missing body');
			}
			const emailExists = await this.createUserRepository.emailExists(
				body.email,
			);
			if (emailExists) {
				return conflict('Email already exists');
			}
			const user = await this.createUserRepository.createUser(body);
			return created<User>(user);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('Error: ' + err?.message);
			return serverError();
		}
	}
}
