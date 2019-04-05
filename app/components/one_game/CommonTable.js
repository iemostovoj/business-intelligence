import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {bi} from '../general';

const styles = theme => ({
	root: {
		maxWidth: 650,
		marginTop: 10,
		overflowX: 'auto',
	},
	table: {
		width: '100%',
	},
});

let id = 0;
function createData(name, value) {
	id += 1;
	return { id, name, value };
}

class CommonTable extends React.Component {
	getRows = (data) => {
		const dateType = {
			d: "(д.)",
			w: "(нед.)",
			m: "(мес.)",
		};
		const rows = [
			createData(bi.table.labels.game, data.total_data.game),
			createData(bi.table.labels.date_release, data.date.date_release),
			createData('Дата начала сбора данных', data.date.start),
			createData('Пропущено с дня релиза', `${data.date.since_release} ${dateType[data.date.date_unit]}`),
			createData('Дата окончания сбора данных', data.date.end),
			createData(bi.table.labels.deskmob, data.total_data.deskmob),
			createData(bi.table.labels.dpnodp, data.total_data.dpnodp),
			createData(bi.table.labels.rounds, data.total_data.rounds),
			createData(bi.table.labels.mrounds, data.total_data.mrounds),
			createData(bi.table.labels.uniq_players, data.total_data.uniq_players),
			createData(bi.table.labels.sessions, data.total_data.sessions),
			createData(bi.table.labels.rtp, data.total_data.rtp),
			createData(bi.table.labels.recurrence, data.total_data.recurrence),
			createData('Количество валют', Object.keys(data.currency_data).length),
			createData(bi.table.labels.av_mr_pl, data.total_data.av_mr_pl),
			createData(bi.table.labels.av_mr_ses, data.total_data.av_mr_ses),
			createData(bi.table.labels.av_ses_pl, data.total_data.av_ses_pl),
			createData(bi.table.labels.av_bet, data.total_data.av_bet),
		];
		if (data.access === "advanced") {
			rows.push(createData(bi.table.labels.bets, data.total_data.advanced.bets));
			rows.push(createData(bi.table.labels.wins, data.total_data.advanced.wins));
			rows.push(createData(bi.table.labels.profit, data.total_data.advanced.profit));
			rows.push(createData(bi.table.labels.av_profit_pl, data.total_data.advanced.av_profit_pl));
			rows.push(createData(bi.table.labels.av_profit_day, data.total_data.advanced.av_profit_day));
			rows.push(createData(bi.table.labels.av_profit_mr, data.total_data.advanced.av_profit_mr));
		}
		return rows;
	}

	state = {
		rows: this.getRows(this.props.data),
	}

	render() {
		const { classes } = this.props;
		return (

			<Paper className={classes.root} style={{ marginLeft: 15 }}>
				<Table className={classes.table}>
					<TableBody>
						{this.state.rows.map(row => {
							return (
								<TableRow key={row.id}>
									<TableCell component="th" scope="row">{row.name}</TableCell>
									<TableCell align="right">{row.value}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Paper>

		);
	}
	
}

CommonTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommonTable);