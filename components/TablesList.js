import React from 'react'

export default class TablesList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {newTableName: '', tables: []};
		
		this.onTableAddHandler = this.onTableAddHandler.bind(this);
		this.fieldTableNameChange = this.fieldTableNameChange.bind(this);
	}

	componentDidMount() {
		fetch('/api/tables')
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				// something went wrong...
				return;
			}

			this.setState({tables: json.result.entries});
		}).catch((error) => {
			console.warn('error:', error);
		});
	}

	onTableAddHandler() {
		// FIXME: fix for new method of sending parms
		fetch(`/api/createTable/${this.state.newTableName}`, {
			method: 'PUT'
		})
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				//
				return;
			}

			this.state.tables.push(this.state.newTableName);
			this.setState({
				tables: this.state.tables,
				newTableName: ''
			});
		})
		.catch(error => {
			console.warn('deleteEntity::ERR', error);
		});
	}

	fieldTableNameChange(event) {
		this.setState({newTableName: event.target.value});
	}

	render() {
		return (
			<div>
				<h3>Tables</h3>
				<div>
					<input type='text' placeholder='New Table Name' value={this.state.newTableName} onChange={this.fieldTableNameChange} />
					<button onClick={this.onTableAddHandler}>+</button>
				</div>
				<ul>
					{this.state.tables.map((table, i) => {
						return (
							<li onClick={this.props.tableClickHandle.bind(null, table)} key={i}>{table} <button>Del</button></li>
						);
					})}
				</ul>
			</div>
		);
	}
}