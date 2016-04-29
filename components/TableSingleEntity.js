import React from 'react'
import EntityItem from './EntityItem'

const TableSingleEntity = React.createClass({
	getInitialState() {
		return {
			entityItems: [{key: 'PartitionKey', val: '', type: 'string'}, {key: 'RowKey', val: '', type: 'string'}]
		}
	},

	componentWillMount() {
		this.props.entity && this.setState({ entityItems: this.props.entity });
	},

	componentWillReceiveProps(newProps) {
		newProps.entity && this.setState({ entityItems: newProps.entity });
	},

	handleEntityItemChange(entityIndex, newKey, newVal, newType){
		this.state.entityItems[entityIndex] = {key: newKey, val: newVal, type: newType};
		this.setState({ entityItems: this.state.entityItems });
	},
	
	addEntityItem() {
		this.state.entityItems.push({key:'', val:''});
		this.setState({ entityItems: this.state.entityItems });
	},

	onDeleteEntityItemHandler(entityIndex){
		// also add to some delete entities variable so that we can tell server to delete those added entities
		// OR, direct reqeust to server from here to delete this entity item
		// this.state.entityItems.splice(entityIndex, 1);
		// this.setState({ entityItems: this.state.entityItems });
	},

	saveEntity() {
		// TODO: this should callback to parent `TableEntities`, to insert new entity into 'list'
		const savingData = {};
		for (let entityItem of this.state.entityItems) {
			savingData[entityItem.key] = entityItem.val;
		}

		console.log('saving data:', savingData);

		// fetch(`/api/${this.props.tableName}/createEntity`, {
		// 	method: 'PUT',
		// 	headers: {
		// 		'Accept': 'application/json',
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify(savingData)
		// });
	},

	render() {
		return (
			<div>
				<div>
					<button onClick={this.addEntityItem}>Add Entity Item</button>&nbsp;
					<button onClick={this.saveEntity}>Save Entity</button>&nbsp;
					<button>Delete Entity</button>
				</div>
				<div>
					{this.state.entityItems.map((item, i) => {
						const props = {
							key: i,
							id: i,
							entityItemKey: item.key,
							entityItemVal: item.val,
							entityItemType: item.type,
							onChangeHandler: this.handleEntityItemChange,
							onDeleteHandler: this.onDeleteEntityItemHandler
						};
						return <EntityItem {...props} />;
					})}
				</div>
			</div>
		);
	}
});

module.exports = TableSingleEntity;