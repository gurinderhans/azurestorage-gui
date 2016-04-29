'use strict';

const azure = require('azure-storage');
const express = require('express');
const bodyParser = require('body-parser');

const creds = require('./creds');
const tableService = azure.createTableService(creds.accountName, creds.secretKey);

const app = express();

const entGen = azure.TableUtilities.entityGenerator;

const entGenTypesMap = {
	'string': entGen.String,
	'number': n => entGen.Int32(Number(n)),
	'boolean': b => entGen.Boolean(typeof b === 'boolean' ? b : b.toLowerCase() === 'true'),
	'datetime': dstr => entGen.DateTime(new Date(dstr))
}

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

router.route('/:tableName/insertOrReplaceEntity').put((req, res) => {

	// convert request data into azure 'save compatible' data
	const azureEntity = {};
	for (let key in req.body) {
		const tEntGen = entGenTypesMap[req.body[key].type];
		if (tEntGen) {
			azureEntity[key] = tEntGen(req.body[key].val);
		} else {
			// TOOD: throw error here or soft convert to string ??
			azureEntity[key] = entGen.String(req.body[key].val);
		}
	}

	console.log('azureEntity:',azureEntity);

	tableService.insertOrReplaceEntity(req.params.tableName, azureEntity, (error, result, response) => {
		if (!error) {
			// result contains the ETag for the new entity
			console.log('result:',result);
			console.log('response:',response);
			res.json({'success': true});
		} else {
			console.log('error:', error);
			res.json(400, {'success': false});
		}
	});
});


app.use('/api', router);
app.listen(8000);