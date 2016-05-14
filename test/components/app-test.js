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

/// MARK: - Tests
describe('<TablesList />', function() {
	it('displays tables', () => {
		const tablesList = shallow(<TablesList tableClickHandle={() => {}} />);
		const tablesToAdd = ['table1', 'table2'];
		tablesList.setState({tables: tablesToAdd});

		expect(tablesList.find('li')).to.have.length(tablesToAdd.length);
		expect(tablesList.find('li > span').first().text()).to.equal(tablesToAdd[0]);
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
});