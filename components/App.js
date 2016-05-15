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
			<div className="row">
				<TablesList selectedTable={this.state.selectedTable} tableClickHandle={this.tableClickHandle} />
				<EntitiesList tableName={this.state.selectedTable} />
			</div>
		);
	}

	tableClickHandle(selectedTable) {
		this.setState({ selectedTable });
	}
}
