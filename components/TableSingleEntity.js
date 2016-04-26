import React from 'react';

var TableSingleEntity = React.createClass({
	render() {
		return (
			<div>
				<div>
					<button>Add Prop Val</button>&nbsp;
					<button>Save Entity</button>
				</div>
				PartitionKey: <input type='text' defaultValue={this.props.entity && this.props.entity.PartitionKey._} /><br/>
				RowKey: <input type='text' defaultValue={this.props.entity && this.props.entity.RowKey._} /><br/>
				Timestamp: <input type='text' defaultValue={this.props.entity && this.props.entity.Timestamp._} /><br/>
			</div>
		);
	}
});

module.exports = TableSingleEntity;