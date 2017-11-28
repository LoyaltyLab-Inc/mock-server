const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/user', function(req, res) {
    console.log('GET /api/user');

    const ans = {
	name: 'Anton',
	surname: 'Vakhrushin',
	position: 'CTO',
	image: 'https://pp.userapi.com/c841227/v841227203/13492/TIjlbFh8sQg.jpg'
    };

    res.send(ans);
});

app.listen(8080, function () {
    console.log('mock server is listening on port 8080');
});
