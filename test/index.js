'use strict';

const test = require('tape');
const request = require('supertest');
const app = require('../server');


/// MARK: - Helper functions

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

const TEST_AddDeleteEntity = (TABLE_NAME) => {

	test(`Create table: ${TABLE_NAME}`, assert => {
		createTableRequest(TABLE_NAME, (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Create table successful');
			assert.end();
		});
	});

	test('Add entity to table', assert => {
		addEntityRequest(TABLE_NAME, 'abc', 'def', [{key: 'customKey', val: 'customVal', 'type': 'string'}], (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.notEqual(res.body.result['.metadata'].etag, undefined, 'Entity Added');
			assert.end();
		});
	});

	test('Delete entity from table', assert => {
		deleteEntityRequest(TABLE_NAME, 'abc', 'def', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.equal(res.body.result.isSuccessful, true, 'Entity Deleted');
			assert.end();
		});
	});

	test(`Delete table: ${TABLE_NAME}`, assert => {
		deleteTableRequest(TABLE_NAME, (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.ok(res.body.result, 'Delete table successful');
			assert.end();
		});
	});
};

const TEST_CreateTableWithInvalidName = () => {

	const randomString = (n) => {let r="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(var o=0;n>o;o++)r+=t.charAt(Math.floor(Math.random()*t.length));return r};
	
	// < 3 chars
	test('Test table names < 3 chars', assert => {
		createTableRequest('aa', (err, res) => {
			assert.equal(res.body.error.name, 'ArgumentError', 'Create table failed');
			assert.end();
		});
	});

	// > 63 chars
	test('Test table names > 63 chars', assert => {
		createTableRequest(randomString(64), (err, res) => {
			assert.equal(res.body.error.name, 'ArgumentError', 'Create table failed');
			assert.end();
		});
	});

	// no name
	test(`Create table with no name`, assert => {
		createTableRequest('/', (err, res) => {
			assert.error(res.body.error, 'No error');
			assert.notOk(res.body.result, 'Create table failed');
			assert.end();
		});
	});
};


/// MARK: - Running Tests

TEST_CreateTableWithInvalidName();

TEST_AddDeleteEntity('randomTable');




// @end ----------------
