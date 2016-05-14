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
		tablesList.setState({tables: ['table1', 'table2']});

		expect(tablesList.find('li')).to.have.length(2);
		expect(tablesList.find('li > span').first().text()).to.equal('table1');
	});
});