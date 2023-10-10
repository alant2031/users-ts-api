import { server } from './server';

const port = process.env.PORT || 3001;

server()
	.then((app) => {
		app.listen(port, () => {
			console.log('Server is up and running on port ' + port);
		});
	})
	.catch((err) => console.log('500 Internal Server Error: ' + err));
