const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const esamoob = require('./esamoob.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/status', (req, res) => {
	res.send("Server is running");
});

app.post('/esam', (req, res) => {
	var url = req.body.url;
	var method = req.body.method;
	var utc_time = req.body.utc_time;
	var scte35_binary = req.body.scte35_binary;
	var acq_id = req.body.acq_id;

	var esam_command = esamoob.make_esam_request(acq_id, utc_time, scte35_binary)

	fetch(url, {
		method: method,
		body: esam_command,
	})
		.then(resp => {
			console.log(resp);
			res.send({
				server_response: {
					error: null,
					status: resp.status,
					statusText: resp.statusText,
				},
				esam_command: esam_command,
			});
		})
		.catch(e => {
			res.send({
				error: e.message,
			});
		});
})

app.listen(process.env.PORT || 8081);