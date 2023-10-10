/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse, HttpStatusCode } from './protocols';

export const created = <T>(body: any): HttpResponse<T> => {
	return {
		statusCode: HttpStatusCode.CREATED,
		body,
	};
};

export const ok = <T>(body: any): HttpResponse<T> => {
	return {
		statusCode: HttpStatusCode.OK,
		body,
	};
};

export const badRequest = (message: string): HttpResponse<string> => {
	return {
		statusCode: HttpStatusCode.BAD_REQUEST,
		body: message,
	};
};

export const conflict = (message: string): HttpResponse<string> => {
	return {
		statusCode: HttpStatusCode.CONFLICT,
		body: message,
	};
};
export const noContent = (message: string): HttpResponse<string> => {
	return {
		statusCode: HttpStatusCode.NO_CONTENT,
		body: message,
	};
};

export const serverError = (): HttpResponse<string> => {
	return {
		statusCode: HttpStatusCode.SERVER_ERROR,
		body: 'Something went wrong',
	};
};
