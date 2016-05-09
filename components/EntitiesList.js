import React from 'react'
import Entity from './Entity'

export default class EntitiesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {entities: []};
		
		this.onEntityItemChangeHandler = this.onEntityItemChangeHandler.bind(this);
		this.onEntityItemDeleteHandler = this.onEntityItemDeleteHandler.bind(this);
		this.onEntityItemAddHandler = this.onEntityItemAddHandler.bind(this);
		this.onEntitySaveHandler = this.onEntitySaveHandler.bind(this);
		this.onEntityDeleteHandler = this.onEntityDeleteHandler.bind(this);
		this.onEntityAddHandler = this.onEntityAddHandler.bind(this);
	}

	componentWillMount() {
		this.fetchEntities(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.fetchEntities(nextProps);
	}

	fetchEntities(props) {
		if (!props.tableName) {
			return;
		}

		fetch(`/api/table/${props.tableName}`)
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				// something went wrong...
				return;
			}

			const mappedEntities = json.result.entries.map(entity => {
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
			console.warn('fetchEntities, error:', error);
		});
	}

	onEntityItemChangeHandler(newVal) {
		this.state.entities[newVal.entityId][newVal.entityItemId] = newVal.item
		this.setState({
			entities: this.state.entities
		});
	}


	onEntityItemDeleteHandler(entityId, entityItemId) {
		this.state.entities[entityId].splice(entityItemId, 1);
		this.setState({
			entities: this.state.entities
		});
	}

	onEntityItemAddHandler(entityId) {
		this.state.entities[entityId].push({key: '', val: '', type: ''});
		this.setState({
			entities: this.state.entities
		});
	}

	onEntitySaveHandler(entityId) {
		fetch(`/api/${this.props.tableName}/insertOrReplaceEntity`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state.entities[entityId])
		})
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				// something went wrong
				console.warn('error:',json.error);
				return;
			}
		})
		.catch(error => {
			console.warn('insertOrReplaceEntity::ERR,', error);
		});
	}

	onEntityDeleteHandler(entityId) {
		fetch(`/api/${this.props.tableName}/deleteEntity`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state.entities[entityId])
		})
		.then(response => response.json())
		.then(json => {
			if (json.error) {
				//
				return;
			}

			this.state.entities.splice(entityId, 1);
			this.setState({
				entities: this.state.entities
			});
		})
		.catch(error => {
			console.warn('deleteEntity::ERR', error);
		});
	}

	onEntityAddHandler() {
		this.state.entities.unshift([{key: 'PartitionKey', val: '', type: 'string'}, {key: 'RowKey', val: '', type: 'string'}])
		this.setState({
			entities: this.state.entities
		});
	}

	render() {
		let entitiesLayout;
		if (this.props.tableName) {
			entitiesLayout = (
				<div>
					<h2>Selected table: {this.props.tableName}, <button onClick={this.onEntityAddHandler}>+</button></h2>
					{this.state.entities.map((entity, i) => {
						return (
							<Entity key={i} data={entity} entityId={i} onEntitySave={this.onEntitySaveHandler} onEntityDelete={this.onEntityDeleteHandler} onEntityItemAdd={this.onEntityItemAddHandler} onEntityItemChange={this.onEntityItemChangeHandler} onEntityItemDelete={this.onEntityItemDeleteHandler} />
						);
					})}
				</div>
			);
		} else {
			entitiesLayout = (<h3>Select a <b><u>table</u></b> from the <i>list</i></h3>);
		}

		return entitiesLayout;
	}
}