import React from 'react';
import TableSingleEntity from './TableSingleEntity'

const TableEntities = React.createClass({
	getInitialState() {
		return {
			entities: []
		}
	},

	componentDidMount() {
		this.fetchEntities()
		console.log('componentDidMount, fetchEntities()')
	},

	componentDidUpdate(prevProps) {
		if (this.props.url != prevProps.url) {
			this.fetchEntities()
			console.log('componentDidUpdate, fetchEntities()')
		}
	},

	fetchEntities() {
		fetch(this.props.url)
		.then(response => response.json())
		.then(response => {
			this.setState({entities: response.entities});
			console.log('fetchEntities got response, set state')
		}).catch((error) => {
			console.error('fetchEntities, error:', error);
		});
	},

	render() {
		console.log('num entities for table:',this.props.url,', #',(this.state.entities.length))
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