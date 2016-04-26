import React from 'react';

var TablesList = React.createClass({
	getInitialState() {
		return {
			entities: []
		}
	},

	componentDidMount() {
		this.fetchEntities()
	},

	componentDidUpdate(prevProps) {
		if (this.props.url != prevProps.url) {
			this.fetchEntities()
		}
	},

	fetchEntities() {
		fetch(this.props.url)
		.then(response => response.json())
		.then(response => {
			this.setState({entities: response.entities});
		}).catch((error) => {
			console.error('error:', error);
		});
	},

	render() {
		return (
			<ul>
				{this.state.entities.map((entity, i) => {
					return <li key={i}>{JSON.stringify(entity)}</li>
				})}
			</ul>
		);
	}
});

module.exports = TablesList;