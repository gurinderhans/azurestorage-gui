import React from 'react'

export default class TablesList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {newTableName: '', tables: []};
		
		this.onTableAddHandler = this.onTableAddHandler.bind(this);
		this.fieldTableNameChangeHandler = this.fieldTableNameChangeHandler.bind(this);
		this.deleteTableHandler = this.deleteTableHandler.bind(this);
	}

	componentDidMount() {
		fetch('/api/fetchTables')
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				console.warn(json.error);
				return;
			}

			this.setState({tables: json.result.entries});
		}).catch((error) => {
			console.warn('error:', error);
		});
	}

	onTableAddHandler() {
		fetch(`/api/createTable?tableName=${this.state.newTableName}`, {
			method: 'PUT'
		})
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				console.warn(json.error);
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

	fieldTableNameChangeHandler(event) {
		this.setState({newTableName: event.target.value});
	}

	deleteTableHandler(deleteTableIndex) {
		fetch(`/api/deleteTable?tableName=${this.state.tables[deleteTableIndex]}`, {
			method: 'PUT'
		})
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				console.warn(json.error);
				return;
			}

			this.state.tables.splice(deleteTableIndex, 1);
			this.setState({
				tables: this.state.tables
			});
		})
		.catch(error => {
			console.warn('deleteTable:ERR', error);
		});
	}

	render() {
		return (
			<div>
				<h3>Tables</h3>
				<div>
					<input type='text' placeholder='New Table Name' value={this.state.newTableName} onChange={this.fieldTableNameChangeHandler} />
					<button onClick={this.onTableAddHandler}>+</button>
				</div>
				<ul>
					{this.state.tables.map((table, i) => {
						return (
							<li key={i}>
								<span onClick={this.props.tableClickHandle.bind(null, table)}>{table}</span>
								&nbsp;
								<button onClick={this.deleteTableHandler.bind(null, i)}>-</button>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}