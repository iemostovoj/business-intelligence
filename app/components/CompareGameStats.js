import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Loading from './Loading';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {bi} from './general';

import RequestComposer from './RequestComposer';
import MacroroundsTable from './compare_games/MacroroundsTable';
import MacroroundsChart from './compare_games/MacroroundsChart';
import PlayersTable from './compare_games/PlayersTable';
import PlayersChart from './compare_games/PlayersChart';
import SpinsPerPlayerTable from './compare_games/SpinsPerPlayerTable';
import SpinsPerPlayerChart from './compare_games/SpinsPerPlayerChart';
import SessionsAndReccurenciesTable from './compare_games/SessionsAndReccurenciesTable';
import AvSessionsPerPlayerChart from './compare_games/AvSessionsPerPlayerChart';
import AvSpinsPerSessionChart from './compare_games/AvSpinsPerSessionChart';
import RecurrenceNewPlayersChart from './compare_games/RecurrenceNewPlayersChart';
import RecurrenceExistingPlayersChart from './compare_games/RecurrenceExistingPlayersChart';

const styles = {
  logo: {
    display: 'inline-flex',
    width: '55%',
    justifyContent: 'center',
    height: 'fit-content',
  },
  card: {
    maxWidth: 340,
  },
};

class CompareGameStats extends React.Component {
	state = {
		data: null,
		macrorounds: null,
		macroroundsChart: null,
		players: null,
		playersChart: null,
		spinsPerPlayer: null,
		spinsPerPlayerChart: null,
		sessAndRecc: null,
		commonData: null,
		mrNormalized: false,
		plNormalized: false,
		sppNormalized: false,
		request: {
			"user_name":"e.mostovoy",
			"mode":1,
		},
		tabValue: 0,
	}

	getMroundsAndPlayers = (data, field, isChart) => {
		let fields = [];
		for (let key in data) {
			if (Number(key)) {
				let interval = data[key].int,
					started = false,
					num = 0,
					row = {};
				for (let prop in interval) {
					started = started || interval[prop].mrounds > 0;
					if (started) {
						row[`date_${++num}`] = field === "mrounds/uniq_players" 
							? Math.floor(interval[prop].mrounds / interval[prop].uniq_players) 
							: interval[prop][field];
					}
				}
				row.count = num;
				row.game = data[key].total_data.game;
				row.normValue = row.date_1;
				fields.push(row);
			}
		}
		if (isChart) return fields;

		// транспонируем матрицу для таблицы
		const total = bi.func.getColumnsCount(fields);
		const dateType = {
			"d": "День #",
			"w": "Неделя #",
			"m": "Месяц #",
		};
		let converted = [];
		for (let i = 0; i < total; i++) {
			let newRow = {};
			newRow.date = dateType[data.date.date_unit] + (i+1);
			for (let d = 0; d < fields.length; d++) {
				newRow[`result_${d+1}`] = fields[d][`date_${i+1}`] || '';
			}
			newRow.id = i + 1;
			converted.push(newRow);
		}
		converted.games = fields.map(obj => obj.game);
		converted.normValues = fields.map(obj => obj.date_1);
		return converted;
	}

	getSessionsAndReccurencies = (data) => {
		let fields = [];
		let counter = 0;
		for (let key in data) {
			if (Number(key)) {
				let totalData = data[key].total_data;
				fields.push({
					id: ++counter,
					game: totalData.game,
					av_ses_pl: totalData.av_ses_pl,
					av_mr_ses: totalData.av_mr_ses,
					recurrence: totalData.recurrence,
					recurrence2: totalData.recurrence2,
				});
			}
		}
		return fields;
	}

	createMessage = (games, json) => {
		let message = Object.assign({}, json);
		message.mode = 3;
		// message.date.date_unit = "m";
		message.games = {};
		for (let i = 1; i <= games.length; i++) {
			message.games[`${i}`] = {
				game_name: games[i - 1].game,
				dp: games[i - 1].dp,
				desk_mob: games[i - 1].desk_mob,
			};
		}
		delete message.desk_mob;
		delete message.dp;
		message = JSON.stringify(message);
	  	return message;
	}

	loadData = (games, json) => {
		this.setState(() => ({data: null, commonData: null}));
	  	let message = this.createMessage(games, json);
	  	console.log("%c" + message, "color: black; font-weight:bold; background-color: PaleGreen;");

	  	let url = bi.postURL;
	  	const request = $.ajax(
	  	{
	  	    type: "POST",
	  	    url: url,
	  	    data: message,
	  	    timeout: 10000
	  	})
	  	.done(data => {
	  		this.setState(() => ({data: JSON.parse(data)}), () => {
	  			const isChart = true;
		    	this.setState(() => ({
	    			macrorounds: this.getMroundsAndPlayers(this.state.data, "mrounds", !isChart),
	    			macroroundsChart: this.getMroundsAndPlayers(this.state.data, "mrounds", isChart),
	    			players: this.getMroundsAndPlayers(this.state.data, "uniq_players", !isChart),
	    			playersChart: this.getMroundsAndPlayers(this.state.data, "uniq_players", isChart),
	    			spinsPerPlayer: this.getMroundsAndPlayers(this.state.data, "mrounds/uniq_players", !isChart),
	    			spinsPerPlayerChart: this.getMroundsAndPlayers(this.state.data, "mrounds/uniq_players", isChart),
	    			sessAndRecc: this.getSessionsAndReccurencies(this.state.data),
	    			commonData: this.state.data,
	    		}), () => {console.log(this.state.data)});
	  		})
	  	})
	  	.fail((xhr, status) => {
	  		console.log("%c" + "failed to load compare games data", "color: black; font-weight:bold; background-color: Red;");
	  	});
	}

	handleNormalizeSwitch = event => {
		this.setState({ [`${event.target.name}Normalized`]: event.target.checked });
	}

	pressLoad = () => {
		for (let i = 0; i < this.props.games.length; i++) {
			this.props.games[i].desk_mob = this.state.request.desk_mob;
			this.props.games[i].dp = this.state.request.dp;
		}
	  	this.loadData(this.props.games, this.state.request);
	}

	setRequestData = (data) => {
		this.setState(prevState => ({
		    request: {
		        ...prevState.request,
		        date: data.date,
		        desk_mob: data.desk_mob,
		        dp: data.dp
		    }
		}));
	}

	handleTabChange = (event, tabValue) => {
	  this.setState({ tabValue });
	};

	componentDidMount = () => {
		this.loadData(this.props.games, this.props.request);
	}

	render() {
		const dateType = {
			"d": "в день",
			"w": "в неделю",
			"m": "в месяц",
		};
		// debugger;
		const word = this.state.commonData
			? dateType[this.state.data.date.date_unit]
			: '';
		const { tabValue } = this.state;

		return (
			<>
				<div className="container" style={{ paddingTop: 25 }}>
					{!this.state.commonData 
						? <Loading />
						: <>
							<div className="container text-center" style={{ paddingTop: 25, marginBottom: 25 }}>
								<RequestComposer 
									setRequestData={this.setRequestData} 
									request={this.props.request} 
									loadBtnCallback={this.pressLoad}
								/>
							</div>
							<h5>Количество макрораундов {word}</h5>
							<FormControlLabel
								control={
									<Switch name="mr" checked={this.state.mrNormalized} onChange={this.handleNormalizeSwitch} aria-label="LoginSwitch" />
								}
								label={this.state.mrNormalized ? "Нормализация данных включена" : "Нормализация данных выключена"}
							/>
							<MacroroundsTable data={this.state.macrorounds} normalized={this.state.mrNormalized} />
							<MacroroundsChart data={this.state.macroroundsChart} normalized={this.state.mrNormalized}/>

							<h5 style={{ paddingTop: 25 }}>Количество игроков {word}</h5>
							<FormControlLabel
								control={
									<Switch name="pl" checked={this.state.plNormalized} onChange={this.handleNormalizeSwitch} aria-label="LoginSwitch" />
								}
								label={this.state.plNormalized ? "Нормализация данных включена" : "Нормализация данных выключена"}
							/>
							<PlayersTable data={this.state.players} normalized={this.state.plNormalized} />
							<PlayersChart data={this.state.playersChart} normalized={this.state.plNormalized} />

							<h5 style={{ paddingTop: 25 }}>Среднее количество спинов на 1 игрока {word}</h5>
							<FormControlLabel
								control={
									<Switch name="spp" checked={this.state.sppNormalized} onChange={this.handleNormalizeSwitch} aria-label="LoginSwitch" />
								}
								label={this.state.sppNormalized ? "Нормализация данных включена" : "Нормализация данных выключена"}
							/>
							<SpinsPerPlayerTable data={this.state.spinsPerPlayer} normalized={this.state.sppNormalized} />
							<SpinsPerPlayerChart data={this.state.spinsPerPlayerChart} normalized={this.state.sppNormalized} />

							<h5 style={{ paddingTop: 25 }}>Средние показатели на 1 игрока</h5>
							<SessionsAndReccurenciesTable data={this.state.sessAndRecc}/>
							{/*<AvSessionsPerPlayerChart data={this.state.sessAndRecc}/>
							<AvSpinsPerSessionChart data={this.state.sessAndRecc}/>
							<RecurrenceNewPlayersChart data={this.state.sessAndRecc}/>
							<RecurrenceExistingPlayersChart data={this.state.sessAndRecc}/>*/}
							<Paper style={{marginTop: 20, paddingBottom: 30}}>
								<Tabs
									value={this.state.tabValue}
									onChange={this.handleTabChange}
									indicatorColor="primary"
									textColor="primary"
									centered
								>
									<Tab label="Среднее количество сессий на 1 игрока" />
									<Tab label="Среднее количество спинов за сессию" />
									<Tab label="Возвращаемость новых игроков (%)" />
									<Tab label="Возвращаемость существующих игроков (%)" />
								</Tabs>
									{tabValue === 0 && <AvSessionsPerPlayerChart data={this.state.sessAndRecc} />}
									{tabValue === 1 && <AvSpinsPerSessionChart data={this.state.sessAndRecc} />}
									{tabValue === 2 && <RecurrenceNewPlayersChart data={this.state.sessAndRecc} />}
									{tabValue === 3 && <RecurrenceExistingPlayersChart data={this.state.sessAndRecc} />}
							</Paper>
						</>
						
					}
				</div>
			</>
		)
	}
}

export default CompareGameStats;