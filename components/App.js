import React from 'react';
import TablesList from './TablesList'
import TableEntities from './TableEntities'
import TableSingleEntity from './TableSingleEntity'

const App = React.createClass({
	getInitialState() {
		return {
			currentTable: null
		}
	},

	render() {
		return (
			<div className='row'>
				<div className='col-md-3'>
					<h3>Tables</h3>
					<TablesList className='tablesList' tableClick={this.handleClick} url='/api/tables' />
				</div>
				<div className='col-md-9'>
					<TableEntities tableName={this.state.currentTable} />
				</div>
			</div>
		);
	},

	handleClick(clickedTable) {
		this.setState({currentTable: clickedTable});
	}

});

module.exports = App;