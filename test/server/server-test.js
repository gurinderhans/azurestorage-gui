import { agent as request } from 'supertest'
import { expect } from 'chai'
import app from '../../server'

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

describe("TEST::CreateTable", () => {

	it('Create pre-existing table w/ valid name', (done) => {
		createTableRequest('newTable', () => {
			createTableRequest('newTable', (err, res) => {
				expect(res.body.error).to.equal(undefined);
				expect(res.body.result).to.exist;

				deleteTableRequest('newTable');
				
				done();
			});
		});
	});

	it('Create table w/ valid name', (done) => {
		createTableRequest('validTableName', (err, res) => {
			expect(res.body.error).to.equal(undefined);

			expect(res.body.result).to.exist;

			deleteTableRequest('validTableName');
			
			done();
		});
	});

	it('Create table w/ name < 3 chars', (done) => {
		createTableRequest('aa', (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Create table w/ name > 63 chars', (done) => {
		createTableRequest(randomString(64), (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Create table w/ empty name', (done) => {
		createTableRequest('', (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});
});

describe("TEST::DeleteTable", () => {

	it('Delete table w/ valid name', (done) => {
		createTableRequest('someValidName', () => {
			deleteTableRequest('someValidName', (err, res) => {
				expect(res.body.error).to.equal(undefined);
				expect(res.body.result).to.equal(true);
				
				done();
			});
		});
	});

	it('Delete non-existing table w/ valid name', (done) => {
		deleteTableRequest('nonExistingTableValidName', (err, res) => {
			expect(res.body.error).to.equal(undefined);
			expect(res.body.result).to.equal(false);

			done();
		});
	});

	it('Delete table w/ name < 3 chars', (done) => {
		deleteTableRequest('aa', (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Delete table w/ name > 63 chars', (done) => {
		deleteTableRequest(randomString(64), (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Delete table w/ empty name', (done) => {
		deleteTableRequest('', (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});
});

describe("TEST::CreateEntity", () => {
	
	const tbl = 'createEntityTestTable';
	const entityDescriptor = [{key: 'PartitionKey', val: 'pkey', 'type': 'string'}, {key: 'RowKey', val: 'rkey', 'type': 'string'}];

	it('Create basic entity w/ empty table name', (done) => {
		createEntityRequest('', entityDescriptor, (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Create basic entity w/ table name < 3 chars', (done) => {
		createEntityRequest('aa', entityDescriptor, (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Create basic entity w/ table name > 63 chars', (done) => {
		createEntityRequest(randomString(64), entityDescriptor, (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Create basic entity w/ valid table name', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor, (err, res) => {
				expect(res.body.error).to.equal(undefined);
				expect(res.body.result).to.exist;

				done();
			});
		});
	});

	it('Create custom entity w/ valid table name', (done) => {
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
				expect(res.body.error).to.equal(undefined);
				expect(res.body.result).to.exist;

				done();
			});
		});
	});

	it('Create custom entity w/ valid table name and invalid entity values', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor.concat([
				{key: 'dateKey', val: 'not-a-date', 'type': 'datetime'},
				{key: 'numKey', val: 'not-a-date', 'type': 'number'},
			]), (err, res) => {
				expect(res.status).to.equal(400);
				expect(res.body.error).to.not.equal(undefined);

				done();
			});
		});
	});

	it('Create invalid entity w/ valid table name', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, [
				{key: 'PartitionKey', val: '', 'type': 'string'},
				{key: 'Row', val: null, 'type': 'string'}
			], (err, res) => {
				expect(res.status).to.equal(400);
				expect(res.body.error).to.not.equal(undefined);

				done();
			});
		});
	});

	it('Create invalid entity 2 w/ valid table name', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, [], (err, res) => {
				expect(res.status).to.equal(400);
				expect(res.body.error).to.not.equal(undefined);

				done();
			});
		});
	});

	it('Create empty entity w/ valid table name', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, [
				{key: 'PartitionKey', val: '', 'type': 'string'},
				{key: 'RowKey', val: '', 'type': 'string'}
			], (err, res) => {
				expect(res.body.error).to.equal(undefined);
				expect(res.body.result).to.exist;

				/// CLEANUP
				deleteTableRequest(tbl, done);
			});
		});
	});
});

describe("TEST::DeleteEntity", () => {

	const tbl = 'deleteEntityTestTable';
	const entityDescriptor = [{key: 'PartitionKey', val: 'pkey', 'type': 'string'}, {key: 'RowKey', val: 'rkey', 'type': 'string'}];

	it('Delete basic entity', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor, (err, res) => {
				deleteEntityRequest(tbl, entityDescriptor, (err, res) => {
					expect(res.body.error).to.equal(undefined);
					expect(res.body.result).to.exist;

					done();
				});
			});
		});
	});

	it('Delete non-existing entity', (done) => {
		createTableRequest(tbl, () => {
			deleteEntityRequest(tbl, [{key: 'PartitionKey', val: 'nonexisting', 'type': 'string'}, {key: 'RowKey', val: 'nonexisting', 'type': 'string'}], (err, res) => {
				expect(res.status).to.equal(400);
				expect(res.body.error).to.not.equal(undefined);

				done();
			});
		});
	});

	it('Delete empty entity', (done) => {
		createTableRequest(tbl, () => {
			deleteEntityRequest(tbl, [{key: 'PartitionKey', val: '', 'type': 'string'}, {key: 'RowKey', val: '', 'type': 'string'}], (err, res) => {
				expect(res.status).to.equal(400);
				expect(res.body.error).to.not.equal(undefined);

				done();
			});
		});
	});

	it('Delete null entity', (done) => {
		createTableRequest(tbl, () => {
			deleteEntityRequest(tbl, [], (err, res) => {
				expect(res.status).to.equal(400);
				expect(res.body.error).to.not.equal(undefined);

				done();
			});
		});
	});

	it('Delete basic entity w/ empty tableName', (done) => {
		deleteEntityRequest('', entityDescriptor, (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Delete basic entity w/ null tableName', (done) => {
		deleteEntityRequest(null, entityDescriptor, (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Delete entity null request', (done) => {
		deleteEntityRequest(null, [], (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			/// CLEANUP
			deleteTableRequest(tbl, done);
		});
	});
});

describe("TEST::FetchTables", () => {

	it('Fetch tables', (done) => {
		fetchTablesRequest((err, res) => {
			expect(res.body.error).to.equal(undefined);
			expect(res.body.result).to.exist;

			done();
		});
	});
});

describe("TEST::FetchEntities", () => {

	const tbl = 'fetchEntitiesTableName';
	const entityDescriptor = [{key: 'PartitionKey', val: 'pkey', 'type': 'string'}, {key: 'RowKey', val: 'rkey', 'type': 'string'}];

	it('Fetch entities from table w/ count 0', (done) => {
		createTableRequest(tbl, () => {
			fetchTableEntitiesRequest(tbl, (err, res) => {
				expect(res.body.error).to.equal(undefined);
				expect(res.body.result).to.exist;
				expect(res.body.result.entries.length).to.equal(0);
				
				done();
			});
		});
	});

	it('Fetch entities from table w/ count 1', (done) => {
		createTableRequest(tbl, () => {
			createEntityRequest(tbl, entityDescriptor, () => {
				fetchTableEntitiesRequest(tbl, (err, res) => {
					expect(res.body.error).to.equal(undefined);
					expect(res.body.result).to.exist;
					expect(res.body.result.entries.length).to.equal(1);
					
					/// CLEANUP
					deleteTableRequest(tbl, done);
				});
			});
		});
	});

	it('Fetch entities w/o table', (done) => {
		fetchTableEntitiesRequest(null, (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Fetch entities on non-existing table', (done) => {
		fetchTableEntitiesRequest('thisTableShouldNotExist', (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});

	it('Fetch entities on empty table name', (done) => {
		fetchTableEntitiesRequest('', (err, res) => {
			expect(res.status).to.equal(400);
			expect(res.body.error).to.not.equal(undefined);

			done();
		});
	});
});

// @end ----------------