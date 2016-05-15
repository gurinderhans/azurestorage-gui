import React from 'react'
import * as axios from 'axios'

export default class TablesList extends React.Component {

	constructor(props) {
		super(props);
		this.state = { newTableName: '', tables: [] };
		
		this.onTableAddHandler = this.onTableAddHandler.bind(this);
		this.fieldTableNameChangeHandler = this.fieldTableNameChangeHandler.bind(this);
		this.deleteTableHandler = this.deleteTableHandler.bind(this);
	}

	componentDidMount() {
		axios.get('/api/fetchTables')
		.then(response => {
			const json = response.data;

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
		axios.post('/api/createTable', {
			tableName: this.state.newTableName
		})
		.then(response => {
			const json = response.data;

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

	deleteTableHandler(deleteTableIndex, ev) {
		ev.stopPropagation();
		
		axios.post('/api/deleteTable', {
			tableName: this.state.tables[deleteTableIndex]
		})
		.then(response => {
			const json = response.data;

			if (json.error) {
				console.warn(json.error);
				return;
			}

			this.state.tables.splice(deleteTableIndex, 1);
			this.setState({
				tables: this.state.tables
			});

			this.props.tableClickHandle(null);
		})
		.catch(error => {
			console.warn('deleteTable:ERR', error);
		});
	}



	render() {
		return (
			<div className="col-md-3">
				<nav className="navbar navbar-default">
					<div className="container-fluid">
						<div className="navbar-header">
							<a className="navbar-brand">
								AzureTables GUI
							</a>
						</div>
					</div>
				</nav>
				<div className="input-group">
					<input type="text" value={this.state.newTableName} onChange={this.fieldTableNameChangeHandler} placeholder="New table name" className="form-control" aria-label="New table input" />
					<div className="input-group-btn">
						<button type="button" onClick={this.onTableAddHandler} className="btn btn-primary" aria-label="Add"><i className="fa fa-plus" aria-hidden="true"></i></button>
					</div>
				</div>
				<p className="divider" role="separator"></p>
				<div className="list-group">
					{this.state.tables.map((table, i) => {
						return (
							<a key={i} className="list-group-item" onClick={this.props.tableClickHandle.bind(null, table)}>
								{table}<button className="btn btn-danger btn-xs pull-right" onClick={this.deleteTableHandler.bind(null, i)}><i className="fa fa-trash" aria-hidden="true"></i></button>
							</a>
						);
					})}
				</div>
			</div>
		);
	}
}