const azure = require('azure-storage');
const express = require('express');
const bodyParser = require('body-parser');

const creds = require('./creds');
const tableService = azure.createTableService(creds.accountName, creds.secretKey);

const app = express();

// configure body-parser to express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// client side served from public directory
app.use(express.static(__dirname + '/public'));


// api router
const router = express.Router();

// fetch list of all tables
router.get('/tables', (req, res) => {
	tableService.listTablesSegmented(null, (error, result, resp) => {
		if (error) {
			res.json(400, { error: error });
		} else {
			res.json({ tables: result.entries });
		}
	});
});

// fetch all entities for the given table
// TODO: add pagination using the `continuationToken`?
router.get('/table/:tableName', (req, res) => {
	tableService.queryEntities(req.params.tableName, new azure.TableQuery(), null, (error, result, response) => {
		if (error) {
			res.json(400, { error: error });
		} else {
			res.json({ entities: result.entries });
		}
	});
});


app.use('/api', router);
app.listen(8000);