import React from 'react'
import TableSingleEntity from './TableSingleEntity'

const TableEntities = React.createClass({
	getInitialState() {
		return {
			entities: []
		}
	},

	componentWillMount() {
		this.fetchEntities(this.props);
	},

	componentWillReceiveProps(nextProps) {
		this.fetchEntities(nextProps);
	},

	fetchEntities(props) {
		if (!props.tableName) {
			return;
		}

		fetch(`/api/table/${props.tableName}`)
		.then(response => response.json())
		.then(response => {
			const mappedEntities = response.entities.map(entity => {
				// FIXME: find better place to filter .metadata key?
				return Object.keys(entity)
						.filter(key => (key !== '.metadata'))
						.map(key => {
							// FIXME: move this into its own block
							let etype = 'string'; // default we convert everything into string for easier parsing
							if (entity[key].$) {
								if (entity[key].$ === 'Edm.String') {
									etype = 'string';
								} else if (entity[key].$ === 'Edm.DateTime') {
									etype = 'datetime';
								}
							} else {
								etype = typeof entity[key]._;
							}

							return {key, val: entity[key]._, type: etype}
						});
			});
			this.setState({entities: mappedEntities});
		}).catch(error => {
			console.error('fetchEntities, error:', error);
		});
	},

	addEntity(entity) {
		//
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