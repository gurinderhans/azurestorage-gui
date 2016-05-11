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

function createEntityRequest(tableName, entityDescriptor, cb=() => {}) {
	request(app)
	.put(`/api/insertOrReplaceEntity`)
	.query({ tableName: tableName })
	.set('Accept', 'application/json')
	.set('Content-Type', 'application/json')
	.send(entityDescriptor)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function deleteEntityRequest(tableName, entityDescriptor, cb=() => {}) {
	request(app)
	.put(`/api/deleteEntity`)
	.query({ tableName: tableName })
	.set('Accept', 'application/json')
	.set('Content-Type', 'application/json')
	.send(entityDescriptor)
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function fetchTablesRequest(cb=() => {}) {
	request(app)
	.get('/api/fetchTables')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}

function fetchTableEntitiesRequest(tableName, cb=() => {}) {
	request(app)
	.get('/api/fetchEntities/')
	.query({tableName: tableName})
	.expect('Content-Type', /json/)
	.expect(200)
	.end(cb);
}


/// MARK: - Tests Fixtures

const TEST_CreateTable = () => {

	test('Create pre-existing table w/ valid name', assert => {
		createTableRequest('newTable', () => {
			createTableRequest('newTable', (err, res) => {
				assert.error(res.body.error, 'No error');
				assert.ok(res.body.result, 'Create table OK.');
				assert.end();

				deleteTableRequest('newTable');
			});
		});
	});

	test('Create table w/ valid name', assert => {
		createTableRequest('validTableName', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Create table OK.');
			assert.end();

			deleteTableRequest('validTableName');
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

	test('Delete table w/ valid name', assert => {
		createTableRequest('someValidName', () => {
			deleteTableRequest('someValidName', (err, res) => {
				assert.error(res.body.error, 'No error');
				assert.ok(res.body.result, 'Delete table OK.');
				assert.end();
			});
		});
	});

	test('Delete non-existing table w/ valid name', assert => {
		deleteTableRequest('nonExistingTableValidName', (err, res) => {
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
	
	const tbl = 'createEntityTestTable';
	const entityDescriptor = [{key: 'PartitionKey', val: 'pkey', 'type': 'string'}, {key: 'RowKey', val: 'rkey', 'type': 'string'}];

	test('Create basic entity w/ empty table name', assert => {
		createEntityRequest('', entityDescriptor, (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Create entity FAIL.');
			assert.end();
		});
	});

	test('Create basic entity w/ table name < 3 chars', assert => {
		createEntityRequest('aa', entityDescriptor, (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Create entity FAIL.');
			assert.end();
		});
	});

	test('Create basic entity w/ table name > 63 chars', assert => {
		createEntityRequest(randomString(64), entityDescriptor, (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Create entity FAIL.');
			assert.end();
		});
	});

	test('Create basic entity w/ valid table name', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor, (err, res) => {
				assert.error(res.body.error, 'No error');
				assert.ok(res.body.result, 'Create entity OK.');
				assert.end();
			});
		});
	});

	test('Create custom entity w/ valid table name', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor.concat([
				{key: 'strKey', val: 'strVal', 'type': 'string'},
				{key: 'numKey', val: '23', 'type': 'number'},
				{key: 'numKey1', val: 42, 'type': 'number'},
				{key: 'dateKey', val: '2016-05-10T18:36:31.662', 'type': 'datetime'},
				{key: 'boolKey', val: 'false', 'type': 'boolean'},
				{key: 'boolKey1', val: true, 'type': 'boolean'},
				{key: 'uTypeKey', val: '31', 'type': 'unknownType'}
			]), (err, res) => {
				assert.error(res.body.error, 'No error');
				assert.ok(res.body.result, 'Create entity OK.');
				assert.end();
			});
		});
	});

	test('Create custom entity w/ valid table name and invalid entity values', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor.concat([
				{key: 'dateKey', val: 'not-a-date', 'type': 'datetime'},
				{key: 'numKey', val: 'not-a-date', 'type': 'number'},
			]), (err, res) => {
				assert.equal(res.status, 400, 'Returned 400 OK.')
				assert.notEqual(res.body.error, undefined, 'Create entity FAIL.');
				assert.end();
			});
		});
	});

	test('Create invalid entity w/ valid table name', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, [
				{key: 'PartitionKey', val: '', 'type': 'string'},
				{key: 'Row', val: null, 'type': 'string'}
			], (err, res) => {
				assert.equal(res.status, 400, 'Returned 400 OK.')
				assert.notEqual(res.body.error, undefined, 'Create entity FAIL.');
				assert.end();
			});
		});
	});

	test('Create invalid entity 2 w/ valid table name', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, [], (err, res) => {
				assert.equal(res.status, 400, 'Returned 400 OK.')
				assert.notEqual(res.body.error, undefined, 'Create entity FAIL.');
				assert.end();
			});
		});
	});

	test('Create empty entity w/ valid table name', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, [
				{key: 'PartitionKey', val: '', 'type': 'string'},
				{key: 'RowKey', val: '', 'type': 'string'}
			], (err, res) => {
				assert.error(res.body.error, 'No error');
				assert.ok(res.body.result, 'Create entity OK.');
				assert.end();

				/// CLEANUP
				deleteTableRequest(tbl);
			});
		});
	});
}

const TEST_DeleteEntity = () => {

	const tbl = 'deleteEntityTestTable';
	const entityDescriptor = [{key: 'PartitionKey', val: 'pkey', 'type': 'string'}, {key: 'RowKey', val: 'rkey', 'type': 'string'}];

	test('Delete basic entity', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor, (err, res) => {
				deleteEntityRequest(tbl, entityDescriptor, (err, res) => {
					assert.error(res.body.error, 'No error');
					assert.ok(res.body.result, 'Delete entity OK.');
					assert.end();
				});
			});
		});
	});

	test('Delete non-existing entity', assert => {
		createTableRequest(tbl, () => {
			deleteEntityRequest(tbl, [{key: 'PartitionKey', val: 'nonexisting', 'type': 'string'}, {key: 'RowKey', val: 'nonexisting', 'type': 'string'}], (err, res) => {
				assert.equal(res.status, 400, 'Returned 400 OK.')
				assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
				assert.end();
			});
		});
	});

	test('Delete empty entity', assert => {
		createTableRequest(tbl, () => {
			deleteEntityRequest(tbl, [{key: 'PartitionKey', val: '', 'type': 'string'}, {key: 'RowKey', val: '', 'type': 'string'}], (err, res) => {
				assert.equal(res.status, 400, 'Returned 400 OK.')
				assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
				assert.end();
			});
		});
	});

	test('Delete null entity', assert => {
		createTableRequest(tbl, () => {
			deleteEntityRequest(tbl, [], (err, res) => {
				assert.equal(res.status, 400, 'Returned 400 OK.')
				assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
				assert.end();
			});
		});
	});

	test('Delete basic entity w/ empty tableName', assert => {
		deleteEntityRequest('', entityDescriptor, (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
			assert.end();
		});
	});

	test('Delete basic entity w/ null tableName', assert => {
		deleteEntityRequest(null, entityDescriptor, (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
			assert.end();
		});
	});

	test('Delete entity null request', assert => {
		deleteEntityRequest(null, [], (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
			assert.end();

			/// CLEANUP
			deleteTableRequest(tbl);
		});
	});
}

const TEST_FetchTables = () => {

	test('Fetch tables', assert => {
		fetchTablesRequest((err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Fetch tables OK.');
			assert.end();
		});
	});
}

const TEST_FetchEntities = () => {

	const tbl = 'fetchEntitiesTableName';
	const entityDescriptor = [{key: 'PartitionKey', val: 'pkey', 'type': 'string'}, {key: 'RowKey', val: 'rkey', 'type': 'string'}];

	test('Fetch entities from table w/ count 0', assert => {
		createTableRequest(tbl, () => {
			fetchTableEntitiesRequest(tbl, (err, res) => {
				assert.error(res.body.error, 'No error');
				assert.ok(res.body.result, 'Fetch entities OK.');
				assert.equal(res.body.result.entries.length, 0, 'Entity count is 0');
				assert.end();
			});
		});
	});

	test('Fetch entities from table w/ count 1', assert => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor, () => {
				fetchTableEntitiesRequest(tbl, (err, res) => {
					assert.error(res.body.error, 'No error');
					assert.ok(res.body.result, 'Fetch entities OK.');
					assert.equal(res.body.result.entries.length, 1, 'Entity count is 1');
					assert.end();
				});
			});
		});
	});

	test('Fetch entities w/o table', assert => {
		fetchTableEntitiesRequest(null, (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
			assert.end();
		});
	});

	test('Fetch entities on non-existing table', assert => {
		fetchTableEntitiesRequest('thisTableShouldNotExist', (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
			assert.end();
		});
	});

	test('Fetch entities on empty table name', assert => {
		fetchTableEntitiesRequest('', (err, res) => {
			assert.equal(res.status, 400, 'Returned 400 OK.')
			assert.notEqual(res.body.error, undefined, 'Delete entity FAIL.');
			assert.end();

			/// CLEANUP
			deleteTableRequest(tbl);
		});
	});
}




/// MARK: - Run Tests

TEST_CreateTable();

TEST_DeleteTable();

TEST_CreateEntity();

TEST_DeleteEntity();

TEST_FetchTables();

TEST_FetchEntities();


// @end ----------------