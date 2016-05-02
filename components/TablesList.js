import React from 'react'

const TablesList = React.createClass({
	getInitialState() {
		return {
			tables: []
		}
	},

	componentDidMount() {
		fetch('/api/tables')
		.then(response => response.json())
		.then(response => {
			this.setState({tables: response.tables});
		}).catch((error) => {
			console.error('error:', error);
		});
	},

	render() {
		return (
			<ul>
				{this.state.tables.map((table, i) => {
					return <li onClick={this.props.tableClickHandle.bind(null, table)} key={i}>{table}</li>
				})}
			</ul>
		);
	}
});

module.exports = TablesList;