import React from 'react';
import TablesList from './TablesList'
import TableEntities from './TableEntities'

var App = React.createClass({
	getInitialState() {
		return {
			currentTable: null
		}
	},

	render() {
		let entitiesLayout;
		if (this.state.currentTable) {
			entitiesLayout = (
				<TableEntities url={`/api/table/${this.state.currentTable}`} />
			);
		} else {
			entitiesLayout = (
				<h3>Select a <b>table</b> from the <i>left</i>.</h3>
			);
		}

		return (
			<div className='row'>
				<div className='col-md-3'>
					<h3>Tables +</h3>
					<TablesList tableClick={this.handleClick} url='/api/tables' />
				</div>
				<div className='col-md-9'>
					{entitiesLayout}
				</div>
			</div>
		);
	},

	handleClick(clickedTable) {
		this.setState({currentTable: clickedTable});
	}

});

module.exports = App;