import React from 'react';

var TableSingleEntity = React.createClass({
	render() {
		console.log(this.props)
		return (
			<div>
				<div>
					<button>Add Prop Val</button>&nbsp;
					<button>Save Entity</button>
				</div>
				{this.props.entity ? Object.keys(this.props.entity).map((key, i) => {
					if (key === 'PartitionKey' || key === 'RowKey') {
						return (
							<div key={i}>
								{key}: {<input type='text' value={this.props.entity[key]._} readOnly />}
							</div>
						);
					} else {
						return (
							<div key={i}>
								<input type='text' value={key} readOnly />
								<input type='text' value={this.props.entity[key]._} readOnly />
							</div>
						);
					}
				}) : 
				<div>
					PartitionKey: <input type='text' /><br/>
					RowKey: <input type='text' />
				</div>
				}
			</div>
		);
	}
});

module.exports = TableSingleEntity;