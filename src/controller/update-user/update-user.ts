import { User } from '../../model/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { IUpdateUserParams, IUpdateUserRepository } from './protocols';
import { badRequest, ok, serverError } from '../helpers';

export class UpdateUserController implements IController {
	constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
	async handle(
		httpRequest: HttpRequest<IUpdateUserParams>,
	): Promise<HttpResponse<User | string>> {
		try {
			const id = httpRequest?.params?.id;
			const body = httpRequest?.body;
			if (!id) {
				return badRequest('Missing user id');
			}
			if (!body) {
				return badRequest('Missing body');
			}
			const allowedFields: (keyof IUpdateUserParams)[] = [
				'firstName',
				'lastName',
			];
			const fieldNotAllowedToUpdate = Object.keys(body).some(
				(key) =>
					!allowedFields.includes(key as keyof IUpdateUserParams),
			);
			if (fieldNotAllowedToUpdate) {
				return badRequest('Field not allowed');
			}
			const user = await this.updateUserRepository.updateUser(id, body);
			return ok<User>(user);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('Error: ' + err?.message);
			return serverError();
		}
	}
}
