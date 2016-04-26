import React from 'react';

var TablesList = React.createClass({
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
			console.warn(error);
		});
	},

	render() {
		return (
			<ul>
				{this.state.tables.map(table => {
					return <li key={table}>{table}</li>
				})}
			</ul>
		);
	}
});

module.exports = TablesList;