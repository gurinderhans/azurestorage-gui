import React from 'react';
import PropVal from './PropVal';

const TableSingleEntity = React.createClass({
	getInitialState() {
		return {
			entityItems: [
				{propKey: 'PartitionKey', propVal: ''}
				, {propKey: 'RowKey', propVal: ''}
			]
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
				entityItems: Object.keys(props.entity).map((propKey, i) => {
					return {propKey, propVal: props.entity[propKey]._};
				})
			});
		}
	},
	
	addPropVal() {
		const propvals = this.refs;
		console.log(propvals);
		// const newentityItems = this.state.entityItems;
		// newentityItems[''] = '';
		// this.setState({
		// 	entityItems: newentityItems
		// });
	},

	saveEntity() {
		console.log('saving:', this.state.entityItems);
	},

	handlePropValChange(propValFieldNum, propKey, propVal){
		const newEntityState = this.state.entityItems;
		newEntityState[propValFieldNum] = {propKey, propVal};

		this.setState({
			entityItems: newEntityState,
		});
	},

	render() {
		return (
			<div>
				<div>
					<button onClick={this.addPropVal}>Add Prop Val</button>&nbsp;
					<button onClick={this.saveEntity}>Save Entity</button>&nbsp;
					<button>Delete Entity</button>
				</div>
				<div>
					{this.state.entityItems.map((item, i) => {
						const props = {
							key: i,
							id: i,
							propKey: item.propKey,
							propVal: item.propVal,
							onChange: this.handlePropValChange
						};
						return <PropVal {...props} />;
					})}
				</div>
			</div>
		);
	}
});

module.exports = TableSingleEntity;