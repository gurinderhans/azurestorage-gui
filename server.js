'use strict';

// Load env vars
require('env2')('config.env');

const azure = require('azure-storage');
const express = require('express');
const bodyParser = require('body-parser');

const tableService = azure.createTableService(process.env.ACCOUNT_NAME, process.env.SECRET_KEY);

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


router.route('/createTable').put((req, res) => {
	try {
		tableService.createTableIfNotExists(req.query.tableName, function(error, result, response) {
			if (error) {
				res.status(400).json({error: error});
			} else {
				res.json({result: result});
			}
		});
	} catch (error) {
		res.status(400).json({error: {name: error.name, message: error.message}});
	}
});

router.route('/deleteTable').put((req, res) => {
	try {
		tableService.deleteTableIfExists(req.query.tableName, function(error, result, response) {
			if (error) {
				res.status(400).json({error: error});
			} else {
				res.json({result: result});
			}
		});
	} catch (error) {
		res.status(400).json({error: {name: error.name, message: error.message}});
	}
});

router.route('/insertOrReplaceEntity').put((req, res) => {

	try {
		const azureEntity = toAzure(req.body);

		tableService.insertOrReplaceEntity(req.query.tableName, azureEntity, (error, result, response) => {
			if (error) {
				res.status(400).json({error: error});
			} else {
				res.json({result: result});
			}
		});
	} catch (error) {
		res.status(400).json({error: {name: error.name, message: error.message}});
	}
});

router.route('/deleteEntity').put((req, res) => {
	try {
		const azureEntity = toAzure(req.body);

		tableService.deleteEntity(req.query.tableName, azureEntity, (error, result, response) => {
			if (error) {
				res.status(400).json({error: error});
			} else {
				res.json({result: result});
			}
		});
	} catch (error) {
		res.status(400).json({error: {name: error.name, message: error.message}});
	}
});

// fetch list of all tables
router.get('/fetchTables', (req, res) => {
	tableService.listTablesSegmented(null, (error, result, resp) => {
		if (error) {
			res.status(400).json({error: error});
		} else {
			res.json({result: result});
		}
	});
});

// fetch all entities for the given table
// TODO: add pagination using the `continuationToken`?
router.get('/fetchEntities', (req, res) => {
	try {
		tableService.queryEntities(req.query.tableName, new azure.TableQuery(), null, (error, result, response) => {
			if (error) {
				res.status(400).json({error: error});
			} else {
				res.json({result: result});
			}
		});
	} catch (error) {
		res.status(400).json({error: {name: error.name, message: error.message}});
	}
});


app.use('/api', router);

module.exports = app;