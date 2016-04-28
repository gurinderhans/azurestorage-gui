import React from 'react';

const TablesList = React.createClass({
	getInitialState() {
		return {
			tables: []
		}
	},

	componentDidMount() {
		fetch(this.props.url)
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
				{this.state.tables.map(table => {
					return <li onClick={this.props.tableClick.bind(null, table)} key={table}>{table}</li>
				})}
			</ul>
		);
	}
});

module.exports = TablesList;