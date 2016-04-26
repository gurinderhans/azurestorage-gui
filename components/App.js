import React from 'react';
import TablesList from './TablesList'

var App = React.createClass({

	render() {

		return (
			<div className='row'>
				<div className='col-md-3'>
					<TablesList url='/api/tables' />
				</div>
				<div className='col-md-9'>
					<h3>Select a <b>table</b> from the <i>left</i>.</h3>
				</div>
			</div>
		);
	}

});

module.exports = App;