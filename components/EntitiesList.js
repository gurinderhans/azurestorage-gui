import React from 'react'
import Entity from './Entity'

const EntitiesList = React.createClass({
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
				return Object.keys(entity)
						.filter(key => (key !== '.metadata'))// FIXME: take this away from here...
						.map(key => {
							let etype;
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

	addNewEntityHandler(entity) {
		this.state.entities.push(entity);
		this.setState({entities: this.state.entities});
	},

	render() {
		let entitiesLayout;
		if (this.props.tableName) {
			entitiesLayout = (
				<div>
					<h2>Selected table: {this.props.tableName}</h2>
					<Entity addNewEntityHandler={this.addNewEntityHandler} tableName={this.props.tableName} />
					{this.state.entities.map((entity, i) => {
						return (
							<Entity key={i} id={i} entity={entity} addNewEntityHandler={this.addNewEntityHandler} tableName={this.props.tableName} />
						);
					})}
				</div>
			);
		} else {
			entitiesLayout = (<h3>Select a <b><u>table</u></b> from the <i>list</i></h3>);
		}

		return entitiesLayout;
	}
});

module.exports = EntitiesList;