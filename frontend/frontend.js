const createSSEConnection = () => {
	const eventSource = new EventSource('http://localhost:4000/events');

	eventSource.onmessage = (e) => $('#messages').append(`<p>${e.data}</p>`);
	eventSource.onerror = (error) => console.error('SSE-strömmen misslyckades', error);
};


const submitForm = (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const json = JSON.stringify(Object.fromEntries(formData));

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: json
	};

	fetch('http://localhost:4000/sse', options)
		.then((response) => console.log(response))
		.catch((error) => console.error(error))
};


$(() => {
	createSSEConnection();
	$('#form').on("submit", submitForm);
});
