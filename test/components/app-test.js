import React from 'react'
import { jsdom } from 'jsdom'
import { expect } from 'chai'
import { mount, shallow, render } from 'enzyme'

import App from '../../components/App'
import TablesList from '../../components/TablesList'

/// MARK: - Setup JSDom for `enzyme` to play with
{
	const doc = jsdom('');
	global.document = doc;
	global.window = doc.defaultView;
}

// about 2secs for each request is fine for the roundtrip
const SERVER_REQ_TIMEOUT = 2000;

/// MARK: - Tests

describe('<TablesList />', function() {
	it('displays tables', () => {
		const tablesList = shallow(<TablesList tableClickHandle={() => {}} />);
		const tablesToAdd = ['table1', 'table2'];
		tablesList.setState({tables: tablesToAdd});

		expect(tablesList.find('ul > li')).to.have.length(tablesToAdd.length);
		expect(tablesList.find('ul > li > span').first().text()).to.equal(tablesToAdd[0]);
	});

	it('can type in new table name', () => {

		const tablesList = shallow(<TablesList tableClickHandle={() => {}} />);
		const tblNameInput = tablesList.find('input[type="text"]');

		expect(tblNameInput).to.exist;
		
		const inputVal = 'new value';
		tblNameInput.simulate('change', {target: {value: inputVal}});
		expect(tablesList.state().newTableName).to.equal(inputVal);

		// test `null`
		tblNameInput.simulate('change', {target: {value: null}});
		expect(tablesList.state().newTableName).to.equal(null);
	});

	it('can create table', done => {

		const tablesList = shallow(<TablesList tableClickHandle={() => {}} />);
		const tblNameInput = tablesList.find('input[type="text"]');

		expect(tablesList.find('ul > li')).to.have.length(0);

		tblNameInput.simulate('change', {target: {value: 'newTable'}});

		const addTableBtn = tablesList.find('div > button');
		addTableBtn.simulate('click');

		setTimeout(() => {
			tablesList.update();
			expect(tablesList.find('ul > li')).to.have.length(1);
			done();
		}, SERVER_REQ_TIMEOUT);
	});

	it('loads table list and deletes first one', done => {
		const tablesList = mount(<TablesList tableClickHandle={() => {}} />);

		setTimeout(() => {
			tablesList.update();
			expect(tablesList.find('ul > li')).to.have.length(1);

			// delete table
			const tblToDelete = tablesList.find('ul > li').first();
			tblToDelete.find('button').simulate('click');

			setTimeout(() => {
				tablesList.update();
				expect(tablesList.find('ul > li')).to.have.length(0);
				done();
			}, SERVER_REQ_TIMEOUT);
		}, SERVER_REQ_TIMEOUT);
	});
});