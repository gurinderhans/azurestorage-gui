import React from 'react'
import * as axios from 'axios'
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

		axios.get('/api/fetchEntities', {
			params: {
				tableName: props.tableName
			}
		})
		.then(response => {
			const json = response.data;

			if (json.error) {
				console.warn(json.error);
				return;
			}

			const mappedEntities = json.result.entries.map(entity => {
				return Object.keys(entity)
						.filter(key => (key !== '.metadata' && key !== 'Timestamp'))// FIXME: take this away from here...
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
		axios.post('/api/insertOrReplaceEntity', {
			tableName: this.props.tableName,
			entityDescriptor: this.state.entities[entityId]
		})
		.then(response => {
			const json = response.data;

			if (json.error) {
				console.warn('error:',json.error);
				return;
			}
		})
		.catch(error => {
			console.warn('insertOrReplaceEntity::ERR,', error);
		});
	}

	onEntityDeleteHandler(entityId) {
		axios.post('/api/deleteEntity', {
			tableName: this.props.tableName,
			entityDescriptor: this.state.entities[entityId]
		})
		.then(response => {
			const json = response.data;

			if (json.error) {
				console.warn(json.error);
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
				<div className="col-md-9">
					<h2 className="well">Selected table: <b>{this.props.tableName}</b> <button className="btn btn-success" onClick={this.onEntityAddHandler}><i className="fa fa-plus" aria-hidden="true"></i></button></h2>
					<div className="row">
						{this.state.entities.map((entity, i) => {
							return (
								<Entity key={i} data={entity} entityId={i} onEntitySave={this.onEntitySaveHandler} onEntityDelete={this.onEntityDeleteHandler} onEntityItemAdd={this.onEntityItemAddHandler} onEntityItemChange={this.onEntityItemChangeHandler} onEntityItemDelete={this.onEntityItemDeleteHandler} />
							);
						})}
					</div>
				</div>
			);
		} else {
			entitiesLayout = (<h3>Select a <b><u>table</u></b> from the <i>list</i></h3>);
		}

		return entitiesLayout;
	}
}