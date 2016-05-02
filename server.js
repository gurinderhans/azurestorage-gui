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
	'datetime': dstr => entGen.DateTime(new Date(dstr)),
	'boolean': b => entGen.Boolean(typeof b === 'boolean' ? b : b.toLowerCase() === 'true')
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
			res.status(400).json({ error: error })
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
			res.status(400).json({ error: error });
		} else {
			res.json({ entities: result.entries });
		}
	});
});

router.route('/:tableName/deleteEntity').put((req, res) => {
	
	// convert request data into azure 'compatible' data
	const azureEntity = {};
	for (let entItem of req.body) {
		const tEntGen = entGenTypesMap[entItem.type];
		if (tEntGen) {
			azureEntity[entItem.key] = tEntGen(entItem.val);
		} else {
			// TOOD: throw error here or soft convert to string ??
			azureEntity[entItem.key] = entGen.String(entItem.val);
		}
	}

	tableService.deleteEntity(req.params.tableName, azureEntity, (error, result, response) => {
		if (!error) {
			// result contains the ETag for the new entity, use for ??
			console.log('result:',result);
			console.log('response:',response);
			res.json({success: true});
		} else {
			console.log('error:', error);
			res.status(400).json({success: false});
		}
	});
});

router.route('/:tableName/insertOrReplaceEntity').put((req, res) => {
	
	// convert request data into azure 'compatible' data
	const azureEntity = {};
	for (let entItem of req.body) {
		const tEntGen = entGenTypesMap[entItem.type];
		if (tEntGen) {
			azureEntity[entItem.key] = tEntGen(entItem.val);
		} else {
			// TODO: throw error here or soft convert to string ??
			azureEntity[entItem.key] = entGen.String(entItem.val);
		}
	}

	console.log('azureEntity:',azureEntity);

	tableService.insertOrReplaceEntity(req.params.tableName, azureEntity, (error, result, response) => {
		if (!error) {
			// result contains the ETag for the new entity, use for ??
			console.log('result:',result);
			console.log('response:',response);
			res.json({success: true});
		} else {
			console.log('error:', error);
			res.status(400).json({success: false});
		}
	});
});


app.use('/api', router);
app.listen(8000);