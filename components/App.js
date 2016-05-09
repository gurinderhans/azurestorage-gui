import React from 'react'
import TablesList from './TablesList'
import EntitiesList from './EntitiesList'

export default class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {selectedTable: null};
		
		this.tableClickHandle = this.tableClickHandle.bind(this);
	}

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
	}

	tableClickHandle(selectedTable) {
		this.setState({selectedTable});
	}
}
