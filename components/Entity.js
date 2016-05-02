import React from 'react'
import EntityItem from './EntityItem'

const Entity = React.createClass({
	getInitialState() {
		return {
			entityItems: [{key: 'PartitionKey', val: '', type: 'string'}, {key: 'RowKey', val: '', type: 'string'}]
		}
	},

	componentWillMount() {
		this.setState({ entityItems: this.props.entity || this.state.entityItems });
	},

	componentWillReceiveProps(newProps) {
		this.setState({ entityItems: this.props.entity || this.state.entityItems });
	},

	entityItemChangeHandler(entityIndex, newKey, newVal, newType) {
		this.state.entityItems[entityIndex] = {key: newKey, val: newVal, type: newType};
		this.setState({ entityItems: this.state.entityItems });
	},
	
	addEntityItemHandler() {
		this.state.entityItems.push({key:'', val:''});
		this.setState({ entityItems: this.state.entityItems });
	},

	deleteEntityItemHandler(entityIndex) {
		this.state.entityItems.splice(entityIndex, 1);
		this.setState({ entityItems: this.state.entityItems });
	},

	saveEntity() {
		fetch(`/api/${this.props.tableName}/insertOrReplaceEntity`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state.entityItems)
		})
		.then(response => response.json())
		.then(json => {
			if (this.props.id === undefined) {
				this.props.addNewEntityHandler(this.state.entityItems);
				this.setState(this.getInitialState());
			}
		})
		.catch(error => {
			console.warn('insertOrReplaceEntity::ERR,', error);
		});
	},

	deleteEntity() {
		fetch(`/api/${this.props.tableName}/deleteEntity`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(this.state.entityItems)
		});
	},

	render() {
		return (
			<div>
				<div>
					<button onClick={this.addEntityItemHandler}>Add Entity Item</button>&nbsp;
					<button onClick={this.saveEntity}>Save Entity</button>&nbsp;
					<button onClick={this.deleteEntity}>Delete Entity</button>
				</div>
				<div>
					{this.state.entityItems.map((item, i) => {
						const props = {
							key: i,
							id: i,
							entityItem: {key: item.key, val: item.val, type: item.type},
							entityItemChangeHandler: this.entityItemChangeHandler,
							deleteEntityItemHandler: this.deleteEntityItemHandler
						};
						return (<EntityItem {...props} />);
					})}
				</div>
				<hr />
			</div>
		);
	}
});

module.exports = Entity;