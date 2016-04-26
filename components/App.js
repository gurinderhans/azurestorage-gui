import React from 'react';
import TablesList from './TablesList'
import TableEntities from './TableEntities'
import TableSingleEntity from './TableSingleEntity'

var App = React.createClass({
	getInitialState() {
		return {
			currentTable: null
		}
	},

	render() {
		let entitiesLayout = (<h3>Select a <b>table</b> from the <i>left</i>.</h3>);
		if (this.state.currentTable) {
			entitiesLayout = (<TableEntities url={`/api/table/${this.state.currentTable}`} />);
		}

		return (
			<div className='row'>
				<div className='col-md-3'>
					<h3>Tables</h3>
					<div>
						<input type='text' placeholder='New Table Name' />
						<button>+</button>
					</div>
					<TablesList className='tablesList' tableClick={this.handleClick} url='/api/tables' />
				</div>
				<div className='col-md-9'>
					<TableSingleEntity />
					<hr/>
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