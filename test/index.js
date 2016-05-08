'use strict';

const test = require('tape');
const request = require('supertest');
const app = require('../server');

// MARK: Tests
const TABLE_NAME = 'randomTable';

// 1. create table
test('Create table', t => {
	request(app)
	.put(`/api/createTable/${TABLE_NAME}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end((err, res) => {
		t.error(err, 'No error');
		t.ok(res.body.result, 'Create table successful.');
		t.end();
	});
});

// 2. fetch table
test('Fetch Table', t => {
	request(app)
	.get(`/api/table/${TABLE_NAME}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end((err, res) => {
		t.error(err, 'No error');
		t.equal(res.body.result.entries.length, 0, 'No. results match 0');
		t.end();
	});
});

// 3. delete table
test('Delete table', t => {
	request(app)
	.put(`/api/deleteTable/${TABLE_NAME}`)
	.expect('Content-Type', /json/)
	.expect(200)
	.end((err, res) => {
		t.error(err, 'No error');
		t.ok(res.body.result, 'Delete table successful.');
		t.end();
	});
});
