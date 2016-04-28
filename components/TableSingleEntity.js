import React from 'react';
import EntityItem from './EntityItem';

const TableSingleEntity = React.createClass({
	getInitialState() {
		return {
			entityItems: [{key: 'PartitionKey', val: ''}, {key: 'RowKey', val: ''}]
		}
	},

	componentWillMount() {
		this.updateState(this.props);
	},

	componentWillReceiveProps(newProps) {
		this.updateState(newProps);
	},

	updateState(props) {
		if (props.entity) {
			// TODO: proper key filtering here to hide special keys such as `.metadata`
			this.setState({
				entityItems: Object.keys(props.entity).map((key, i) => {
					console.log(key)
					return {key, val: props.entity[key]._};
				})
			});
		}
	},

	handleEntityItemChange(entityIndex, newKey, newVal){
		this.state.entityItems[entityIndex] = {key: newKey, val: newVal};
		this.setState({
			entityItems: this.state.entityItems,
		});
	},
	
	addEntityItem() {
		this.state.entityItems.push({key:'', val:''});
		this.setState({
			entityItems: this.state.entityItems
		});
	},

	onDeleteEntityItemHandler(entityIndex){
		// also add to some delete entities variable so that we can tell server to delete those added entities
		// OR, direct reqeust to server from here to delete this entity item
		this.state.entityItems.splice(entityIndex, 1);
		this.setState({ entityItems: this.state.entityItems });
	},

	saveEntity() {
		const savingData = {};
		for (let eItem of this.state.entityItems) {
			savingData[eItem.key] = eItem.val;
		}
		fetch(`/api/${this.props.tableName}/createEntity`, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(savingData)
		});
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