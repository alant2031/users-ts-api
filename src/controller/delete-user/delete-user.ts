import { User } from '../../model/user';
import { HttpRequest, HttpResponse, IController } from '../protocols';
import { IDeleteUserRepository } from './protocols';
import { badRequest, noContent, serverError } from '../helpers';

export class DeleteUserController implements IController {
	constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
	async handle(
		httpRequest: HttpRequest<unknown>,
	): Promise<HttpResponse<User | string>> {
		try {
			const id = httpRequest?.params?.id;
			if (!id) {
				return badRequest('Missing user id');
			}
			const user = await this.deleteUserRepository.deleteUser(id);
			return noContent('User ' + user.firstName + 'succesfully deleted');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('Error: ' + err?.message);
			return serverError();
		}
	}
}
