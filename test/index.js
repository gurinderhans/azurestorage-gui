const test = require('tape');
const request = require('supertest');
const app = require('../server');


/// MARK: - Helper functions

const randomString = (n) => {let r="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let o=0;n>o;o++)r+=t.charAt(Math.floor(Math.random()*t.length));return r};

function fetchTableEntitiesRequest(tableName, cb) {
	request(app)
	.get(`/api/table/${tableName}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function fetchTables(cb) {
	request(app)
	.get('/api/tables/')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function createTableRequest(tableName, cb) {
	request(app)
	.put(`/api/createTable/${tableName}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function deleteTableRequest(tableName, cb) {
	request(app)
	.put(`/api/deleteTable/${tableName}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function addEntityRequest(tableName, partitionKey, rowKey, addonItems=[], cb) {
	const entity = [{key: 'PartitionKey', val: partitionKey, 'type': 'string'}, {key: 'RowKey', val: rowKey, 'type': 'string'}].concat(addonItems);

	request(app)
	.put(`/api/${tableName}/insertOrReplaceEntity`)
	.set('Accept', 'application/json')
	.set('Content-Type', 'application/json')
	.send(entity)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function deleteEntityRequest(tableName, partitionKey, rowKey, cb) {
	request(app)
	.put(`/api/${tableName}/deleteEntity`)
	.set('Accept', 'application/json')
	.set('Content-Type', 'application/json')
	.send([{key: 'PartitionKey', val: partitionKey, 'type': 'string'}, {key: 'RowKey', val: rowKey, 'type': 'string'}])
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}


/// MARK: - Tests Fixtures

const TEST_AddTable = () => {
	// ...
}

const TEST_DeleteTable = () => {
	// ...
}

const TEST_AddEntity = () => {
	// ...
}

const TEST_DeleteEntity = () => {
	// ...
}

const TEST_FetchTables = () => {
	// ...
}

const TEST_FetchEntities = () => {
	// ...
}














// const TEST_AddFetchDeleteEntity = (TABLE_NAME) => {

// 	test(`Create table: ${TABLE_NAME}`, assert => {
// 		createTableRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Create table successful');
// 			assert.end();
// 		});
// 	});

// 	test('Add entity to table', assert => {
// 		addEntityRequest(TABLE_NAME, 'abc', 'def', [{key: 'customKey', val: 'customVal', 'type': 'string'}, {key: 'numKey', val: '3', 'type': 'number'}, {key: 'boolKey', val: false, 'type': 'boolean'}, {key: 'dateKey', val: '2016-05-10T04:00:26.874', 'type': 'datetime'}], (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.notEqual(res.body.result['.metadata'].etag, undefined, 'Entity Added');
// 			assert.end();
// 		});
// 	});

// 	test('Fetch table entities', assert => {
// 		fetchTableEntitiesRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.equal(res.body.result.entries.length, 1, 'Entity count is 1');
// 			assert.end();
// 		});
// 	});

// 	test('Delete entity from table', assert => {
// 		deleteEntityRequest(TABLE_NAME, 'abc', 'def', (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.equal(res.body.result.isSuccessful, true, 'Entity Deleted');
// 			assert.end();
// 		});
// 	});

// 	test('Fetch table entities', assert => {
// 		fetchTableEntitiesRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.equal(res.body.result.entries.length, 0, 'Entity count is 0');
// 			assert.end();
// 		});
// 	});

// 	test(`Delete table: ${TABLE_NAME}`, assert => {
// 		deleteTableRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Delete table successful');
// 			assert.end();
// 		});
// 	});
// };

// const TEST_CreateTableWithInvalidName = () => {
	
// 	// < 3 chars
// 	test('Test table names < 3 chars', assert => {
// 		createTableRequest('aa', (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.')
// 			assert.notEqual(res.body.error, undefined, 'Create table failed');
// 			assert.end();
// 		});
// 	});

// 	// > 63 chars
// 	test('Test table names > 63 chars', assert => {
// 		createTableRequest(randomString(64), (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.')
// 			assert.notEqual(res.body.error, undefined, 'Create table failed');
// 			assert.end();
// 		});
// 	});

// 	// no name
// 	test(`Create table with no name`, assert => {
// 		createTableRequest('/', (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.notOk(res.body.result, 'Create table failed');
// 			assert.end();
// 		});
// 	});
// };

// const TEST_DeleteGhostEntity = (TABLE_NAME) => {

// 	test(`Create table: ${TABLE_NAME}`, assert => {
// 		createTableRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Create table successful');
// 			assert.end();
// 		});
// 	});

// 	test('Delete ghost entity from table', assert => {
// 		deleteEntityRequest(TABLE_NAME, 'abc', 'def', (err, res) => {
// 			assert.equal(res.body.error.statusCode, 404, 'Delete entity failed');
// 			assert.end();
// 		});
// 	});

// 	test(`Delete table: ${TABLE_NAME}`, assert => {
// 		deleteTableRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Delete table successful');
// 			assert.end();
// 		});
// 	});
// };

// const TEST_AddInvalidEntity = (TABLE_NAME) => {

// 	test(`Create table: ${TABLE_NAME}`, assert => {
// 		createTableRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Create table successful');
// 			assert.end();
// 		});
// 	});

// 	test('Add entity `null` partitionKey', assert => {
// 		addEntityRequest(TABLE_NAME, undefined, '', undefined, (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.');
// 			assert.notEqual(res.body.error, undefined, 'Got TypeError, addEntity failed.');
// 			assert.end();
// 		});
// 	});

// 	test('Add entity `null` rowKey', assert => {
// 		addEntityRequest(TABLE_NAME, '', null, undefined, (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.');
// 			assert.notEqual(res.body.error, undefined, 'Got TypeError, addEntity failed.');
// 			assert.end();
// 		});
// 	});

// 	test('Add entity `null` tableName', assert => {
// 		addEntityRequest(null, '', '', undefined, (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.');
// 			assert.notEqual(res.body.error, undefined, 'No table found, addEntity failed.');
// 			assert.end();
// 		});
// 	});

// 	test('Add entity empty tableName', assert => {
// 		addEntityRequest('', '', '', undefined, (err, res) => {
// 			assert.equal(res.status, 404, 'Malformed URL, 404, addEntity failed.');
// 			assert.end();
// 		});
// 	});

// 	test(`Delete table: ${TABLE_NAME}`, assert => {
// 		deleteTableRequest(TABLE_NAME, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Delete table successful');
// 			assert.end();
// 		});
// 	});
// };

// const TEST_DeleteTableWithInvalidName = () => {

// 	// < 3 chars
// 	test(`Delete ghost table w/ < 3 chars`, assert => {
// 		deleteTableRequest('aa', (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.');
// 			assert.notEqual(res.body.error, undefined, 'Delete table failed gracefully.');
// 			assert.end();
// 		});
// 	});

// 	// > 63 chars
// 	test(`Delete ghost table w/ > 63 chars`, assert => {
// 		deleteTableRequest(randomString(64), (err, res) => {
// 			assert.equal(res.status, 400, 'Returned 400 OK.');
// 			assert.notEqual(res.body.error, undefined, 'Delete table failed gracefully.');
// 			assert.end();
// 		});
// 	});

// 	// random uncreated table
// 	test(`Delete ghost table w/ random valid name`, assert => {
// 		deleteTableRequest('nonExistentValidTableName', (err, res) => {
// 			assert.notOk(res.body.result, 'Delete table failed gracefully.');
// 			assert.end();
// 		});
// 	});

// 	// empty table name
// 	test(`Delete ghost table w/ empty name`, assert => {
// 		deleteTableRequest('', (err, res) => {
// 			assert.equal(res.status, 404, '404, Delete table failed gracefully.');
// 			assert.end();
// 		});
// 	});
// };

// const TEST_FetchDeleteTables = (TABLE_NAME_1, TABLE_NAME_2) => {
	
// 	test(`Create table: ${TABLE_NAME_1}`, assert => {
// 		createTableRequest(TABLE_NAME_1, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Create table successful');
// 			assert.end();
// 		});
// 	});

// 	test('Table count', assert => {
// 		fetchTables((err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.equal(res.body.result.entries.length, 1, 'Table count is 1');
// 			assert.end();
// 		});
// 	});

// 	test(`Create table: ${TABLE_NAME_2}`, assert => {
// 		createTableRequest(TABLE_NAME_2, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Create table successful');
// 			assert.end();
// 		});
// 	});

// 	test('Table count', assert => {
// 		fetchTables((err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.equal(res.body.result.entries.length, 2, 'Table count is 2');
// 			assert.end();
// 		});
// 	});

// 	test(`Delete table: ${TABLE_NAME_1}`, assert => {
// 		deleteTableRequest(TABLE_NAME_1, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Delete table successful');
// 			assert.end();
// 		});
// 	});

// 	test(`Delete table: ${TABLE_NAME_1} will fail`, assert => {
// 		deleteTableRequest(TABLE_NAME_1, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.notOk(res.body.result, 'Delete table failed. Table already deleted.');
// 			assert.end();
// 		});
// 	});

// 	test(`Delete table: ${TABLE_NAME_2}`, assert => {
// 		deleteTableRequest(TABLE_NAME_2, (err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.ok(res.body.result, 'Delete table successful');
// 			assert.end();
// 		});
// 	});

// 	test('Table count check 0', assert => {
// 		fetchTables((err, res) => {
// 			assert.error(res.body.error, 'No error');
// 			assert.equal(res.body.result.entries.length, 0, 'All deleted, table count is 0');
// 			assert.end();
// 		});
// 	});
// }


// /// MARK: - Running Tests

// TEST_CreateTableWithInvalidName();

// TEST_AddFetchDeleteEntity('random0');

// TEST_DeleteGhostEntity('random1');

// TEST_AddInvalidEntity('random2');

// TEST_DeleteTableWithInvalidName();

// TEST_FetchDeleteTables('random3', 'random4');


// // @end ----------------
