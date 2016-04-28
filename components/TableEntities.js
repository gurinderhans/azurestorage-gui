import React from 'react';
import TableSingleEntity from './TableSingleEntity';

const TableEntities = React.createClass({
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
			console.error('fetchEntities, error:', error);
		});
	},

	render() {
		return (
			<div>
				{this.state.entities.map((entity, i) => {
					return (
						<TableSingleEntity key={i} entity={entity} />
					);
				})}
			</div>
		);
	}
});

module.exports = TableEntities;