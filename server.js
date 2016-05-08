'use strict';

// TODO: refactor `server.js` and take out extra stuff

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

const toAzure = (dataArr) => {
	const azureEntity = {};
	for (let entItem of dataArr) {
		const tEntGen = entGenTypesMap[entItem.type];
		if (tEntGen) {
			azureEntity[entItem.key] = tEntGen(entItem.val);
		} else {
			// for 'unkown' types, soft convert to string
			azureEntity[entItem.key] = entGen.String(entItem.val);
		}
	}
	return azureEntity;
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
			res.status(400).json({error: error, result: undefined});
		} else {
			res.json({error: undefined, result: result});
		}
	});
});

// fetch all entities for the given table
// TODO: add pagination using the `continuationToken`?
router.get('/table/:tableName', (req, res) => {
	tableService.queryEntities(req.params.tableName, new azure.TableQuery(), null, (error, result, response) => {
		if (error) {
			res.status(400).json({error: error, result: undefined});
		} else {
			res.json({error: undefined, result: result});
		}
	});
});

router.route('/createTable/:tableName').put((req, res) => {
	tableService.createTableIfNotExists(req.params.tableName, function(error, result, response) {
		if (error) {
			res.status(400).json({error: error, result: undefined});
		} else {
			res.json({error: undefined, result: result});
		}
	});
});

router.route('/deleteTable/:tableName').put((req, res) => {
	tableService.deleteTableIfExists(req.params.tableName, function(error, result, response) {
		if (error) {
			res.status(400).json({error: error, result: undefined});
		} else {
			res.json({error: undefined, result: result});
		}
	});
});

router.route('/:tableName/deleteEntity').put((req, res) => {

	const azureEntity = toAzure(req.body);

	tableService.deleteEntity(req.params.tableName, azureEntity, (error, result, response) => {
		if (error) {
			res.status(400).json({error: error, result: undefined});
		} else {
			res.json({error: undefined, result: result});
		}
	});
});

router.route('/:tableName/insertOrReplaceEntity').put((req, res) => {
	
	const azureEntity = toAzure(req.body);

	tableService.insertOrReplaceEntity(req.params.tableName, azureEntity, (error, result, response) => {
		if (error) {
			res.status(400).json({error: error, result: undefined});
		} else {
			res.json({error: undefined, result: result});
		}
	});
});


app.use('/api', router);

module.exports = app;