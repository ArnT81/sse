require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { PORT } = process.env;

app.use(cors());
app.use(express.json());

let clients = [], delay = 5000;


const someTimeConsumingAsyncShit = async () => {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			data = { message: 'Task done' };
			resolve(data);
		}, delay)
	});
};


app.post('/sse', (req, res) => {
	try {
		someTimeConsumingAsyncShit()
			.then(data => {
				clients.forEach(client => client.res.write(`data: ${data.message} at ${new Date} \n\n`));
			});

		clients.forEach(client => client.res.write(`data: Task started at ${new Date} \n\n`));
		res.status(202).json({ message: 'Task started' });
	}
	catch (error) {
		console.log('Error in /webhook ', error);
	}
});


// Endpoint för Server-Sent Events (SSE)
app.get('/events', (req, res) => {
	try {
		// Skapa en anslutning för SSE
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');

		// Lägg till klienten i listan över anslutna klienter
		const newClient = { id: Date.now(), res };
		clients.push(newClient);

		// Skicka en bekräftelse till klienten direkt
		res.write('data: Ansluten till SSE-strömmen\n\n');

		// När klienten kopplar ifrån, ta bort den från listan
		req.on('close', () => {
			console.log(`${newClient.id} kopplade ifrån`);
			clients = clients.filter(client => client.id !== newClient.id);
		});
	} catch (error) {
		console.log('Error in /events ', error);
	}
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
