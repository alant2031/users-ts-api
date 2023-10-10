import { ok, serverError } from '../helpers';
import { HttpResponse, IController } from '../protocols';
import { IGetUsersRepository } from './protocols';
import { User } from '../../model/user';

export class GetUsersController implements IController {
	constructor(private readonly getUsersRepository: IGetUsersRepository) {}
	async handle(): Promise<HttpResponse<User[] | string>> {
		// validar request
		// direcionar chamada para o Repository
		try {
			const users = await this.getUsersRepository.getUsers();
			return ok<User[]>(users);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('Error: ' + err?.message);
			return serverError();
		}
	}
}
