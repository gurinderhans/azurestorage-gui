const test = require('tape');
const request = require('supertest');
const app = require('../server');


/// MARK: - Helper functions

const randomString = (n) => {let r="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let o=0;n>o;o++)r+=t.charAt(Math.floor(Math.random()*t.length));return r};

function createTableRequest(tableName, cb=() => {}) {
	request(app)
	.put('/api/createTable')
	.query({ tableName: tableName })
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function deleteTableRequest(tableName, cb=() => {}) {
	request(app)
	.put('/api/deleteTable')
	.query({ tableName: tableName })
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}


// FIXME: fix url route parmams for fns below
function fetchTableEntitiesRequest(tableName, cb=() => {}) {
	request(app)
	.get(`/api/table/${tableName}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function fetchTables(cb=() => {}) {
	request(app)
	.get('/api/tables/')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function addEntityRequest(tableName, partitionKey, rowKey, addonItems=[], cb=() => {}) {
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

function deleteEntityRequest(tableName, partitionKey, rowKey, cb=() => {}) {
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

const TEST_CreateTable = () => {

	test('Create table w/ valid name', assert => {
		createTableRequest('validTableName', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Create table OK.');
			assert.end();
		});
	});
	deleteTableRequest('validTableName');

	createTableRequest('newTable');
	test('Create pre-existing table w/ valid name', assert => {
		createTableRequest('newTable', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Create table OK.');
			assert.end();
		});
	});

	test('Create table w/ name < 3 chars', assert => {
		createTableRequest('aa', (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Create table FAIL.');
			assert.end();
		});
	});

	test('Create table w/ name > 63 chars', assert => {
		createTableRequest(randomString(64), (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Create table FAIL.');
			assert.end();
		});
	});

	test('Create table w/ empty name', assert => {
		createTableRequest('', (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Create table FAIL.');
			assert.end();
		});
	});
}

const TEST_DeleteTable = () => {

	createTableRequest('someValidName');
	test('Delete table w/ valid name', assert => {
		deleteTableRequest('someValidName', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Delete table OK.');
			assert.end();
		});
	});

	test('Delete non-existing table w/ valid name', assert => {
		deleteTableRequest('someValidName', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.equal(res.body.result, false, 'Delete table OK.');
			assert.end();
		});
	});

	test('Delete table w/ name < 3 chars', assert => {
		deleteTableRequest('aa', (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete table FAIL.');
			assert.end();
		});
	});

	test('Delete table w/ name > 63 chars', assert => {
		deleteTableRequest(randomString(64), (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete table FAIL.');
			assert.end();
		});
	});

	test('Delete table w/ empty name', assert => {
		deleteTableRequest('', (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete table FAIL.');
			assert.end();
		});
	});
}

const TEST_CreateEntity = () => {
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




/// MARK: - Run Tests

TEST_CreateTable();

TEST_DeleteTable();


// @end ----------------