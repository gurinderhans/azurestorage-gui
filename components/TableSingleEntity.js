import React from 'react';
import PropVal from './PropVal';

const TableSingleEntity = React.createClass({
	render() {
		return (
			<div>
				<div>
					<button>Add Prop Val</button>&nbsp;
					<button>Save Entity</button>&nbsp;
					<button>Delete Entity</button>
				</div>
				{this.props.entity ? 
					Object.keys(this.props.entity).map((key, i) => {
						return <PropVal key={i} propKey={key} propVal={this.props.entity[key]._} />;
					}) 
					: 
					<div>
						<PropVal propKey={`PartitionKey`} />
						<PropVal propKey={`RowKey`} />
						<PropVal />
					</div>
				}
			</div>
		);
	}
});

module.exports = TableSingleEntity;