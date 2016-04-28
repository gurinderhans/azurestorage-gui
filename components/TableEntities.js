import React from 'react';
import TableSingleEntity from './TableSingleEntity';

const TableEntities = React.createClass({
	getInitialState() {
		return {
			entities: []
		}
	},

	componentWillMount() {
		if (this.props.tableName) {
			this.fetchEntities(this.props);
		}
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.tableName) {
			this.fetchEntities(nextProps);
		}
	},

	fetchEntities(props) {
		fetch(`/api/table/${props.tableName}`)
		.then(response => response.json())
		.then(response => {
			this.setState({entities: response.entities});
		}).catch(error => {
			console.error('fetchEntities, error:', error);
		});
	},

	render() {
		let entitiesLayout = (<h3>Select a <b>table</b> from the <i>left</i>.</h3>);
		if (this.props.tableName) {
			entitiesLayout = (
				<div>
					<h2>Selected table: {this.props.tableName}</h2>
					<TableSingleEntity tableName={this.props.tableName} />
					<hr/>
					{this.state.entities.map((entity, i) => {
						return (
							<TableSingleEntity key={i} entity={entity} tableName={this.props.tableName} />
						);
					})}
				</div>
			);
		}

		return entitiesLayout;
	}
});

module.exports = TableEntities;