import React from 'react'
import TablesList from './TablesList'
import EntitiesList from './EntitiesList'

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
					<TablesList tableClickHandle={this.tableClickHandle} />
				</div>
				<div className='col-md-9'>
					<EntitiesList tableName={this.state.currentTable} />
				</div>
			</div>
		);
	},

	tableClickHandle(clickedTable) {
		this.setState({currentTable: clickedTable});
	}

});

module.exports = App;