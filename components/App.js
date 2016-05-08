import React from 'react'
import TablesList from './TablesList'
import EntitiesList from './EntitiesList'

const App = React.createClass({
	getInitialState() {
		return {
			selectedTable: null
		}
	},

	render() {
		return (
			<div className='row'>
				<div className='col-md-3'>
					<TablesList tableClickHandle={this.tableClickHandle} />
				</div>
				<div className='col-md-9'>
					<EntitiesList tableName={this.state.selectedTable} />
				</div>
			</div>
		);
	},

	tableClickHandle(selectedTable) {
		this.setState({selectedTable});
	}

});

module.exports = App;