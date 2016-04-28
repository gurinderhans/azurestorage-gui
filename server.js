'use strict';

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

router.route('/:tableName/createEntity').put((req, res) => {
	if (!req.params.tableName) {
		// res.json(400);
		res.json(400, {'success': false});
	} else {
		// console.log('body:',req.body);

		const azureEntity = {};
		for (let key in req.body) {
			console.log(typeof req.body[key]);
			// if (req.body[key]) {
			// 	//
			// }
		}

		// tableService.insertEntity(req.params.tableName, req.body, (error, result, response) => {
		// 	if (!error) {
		// 		// result contains the ETag for the new entity
		// 		console.log('result:',result);
		// 		console.log('response:',response);
		// 		res.json({'success': true});
		// 	} else {
		// 		console.log('error:', error);
		// 	}
		// });
	}
	
});


app.use('/api', router);
app.listen(8000);