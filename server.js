const azure = require('azure-storage');
const express = require('express');
const bodyParser = require('body-parser');

const tableService = azure.createTableService('account', 'secretKey');

const app = express();

// configure body-parser to express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// client side served from public directory
app.use(express.static(__dirname + '/public'));


// <api> router
const router = express.Router();

router.get('/tables', function(req, res) {
	tableService.listTablesSegmented(null, (err, result, resp) => {
		if (err) {
			res.render('error', { error: err.message });
			return;
		}

		res.json({ tables: result.entries });
	});
});


app.use('/api', router);
app.listen(8000);