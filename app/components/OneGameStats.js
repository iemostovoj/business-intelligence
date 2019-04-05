import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Loading from './Loading';
import {bi} from './general';

import RequestComposer from './RequestComposer';
import CommonTable from './one_game/CommonTable';
import PlayersSpinsTable from './one_game/PlayersSpinsTable';
import PlayersSpinsChart from './one_game/PlayersSpinsChart';
import CurrenciesTable from './one_game/CurrenciesTable';
import CurrenciesChart from './one_game/CurrenciesChart';
import BetRateTable from './one_game/BetRateTable';
import BetRateChart from './one_game/BetRateChart';
import TimeIntervalTable from './one_game/TimeIntervalTable';
import TimeIntervalPlayersChart from './one_game/TimeIntervalPlayersChart';
import TimeIntervalMrChart from './one_game/TimeIntervalMrChart';
import SessionsTable from './one_game/SessionsTable';
import SessionsChart from './one_game/SessionsChart';


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

function LogoCard(props) {
	return (
		<Card style={styles.card}>
			<CardMedia
				component="img"
				image={`../app/components/assets/${props.game.game}.png`}
				title={props.game}
			/>
		</Card>
	);
}

class OneGameStats extends React.Component {
	state = {
		data: null,
		commonData: null,
		playersSpinsData: null,
		currenciesData: null,
		betRateData: null,
		timeIntervalData: null,
		sessionsData: null,
		request: {
			"user_name":"e.mostovoy",
			"mode":1,
		},
	}

	getPlayersSpinsData = (data) => {
		let fields = [];
		let counter = 0;
		for (let key in data) {
			fields.push({
				id: ++counter,
				min_max: `${data[key].min} - ${data[key].max}`,
				count: data[key].count,
				percent: data[key].percent,
				percent_out: data[key].percent_out,
			});
		}
		return fields;
	}

	getCurrenciesData = (data) => {
		let fields = [];
		let counter = 0;
		for (let key in data) {
			let obj = {
				id: ++counter,
				currency: key,
				mr: data[key].mr,
				mr_percent: data[key].mr_percent,
				bets_percent: data[key].bets_percent,
				rtp: data[key].rtp,
			};
			if (this.state.data.access == "advanced") {
				obj.bets = data[key].advanced.bets;
				obj.wins = data[key].advanced.wins;
				obj.profit = data[key].advanced.profit;
			}
			fields.push(obj);
		}
		console.log(fields);
		return fields;
	}

	getBetRateData = (data) => {
		let fields = [];
		let counter = 0;
		for (let key in data) {
			fields.push({
				id: ++counter,
				min_max: `${data[key].min} - ${data[key].max}`,
				count: data[key].count,
				percent: data[key].percent,
			});
		}
		return fields;
	}

	getIntervalData = (data) => {
		let fields = [];
		let counter = 0;
		for (let key in data) {
			let obj = {
				id: ++counter,
				start: data[key].start,
				end: data[key].end,
				pl: data[key].pl,
				mr: data[key].mr,
				rtp: data[key].rtp,
			};
			if (this.state.data.access == "advanced") {
				obj.bets = data[key].advanced.bets;
				obj.wins = data[key].advanced.wins;
				obj.profit = data[key].advanced.profit;
				obj.total_profit = data[key].advanced.total_profit;
			}
			fields.push(obj);
		}
		return fields;
	}

	getSessionsData = (data) => {
		let fields = [];
		let counter = 0;
		for (let key in data) {
			fields.push({
				id: ++counter,
				sessions: Number(key),
				count: data[key].count,
				percent: data[key].percent,
			});
		}
		return fields;
	}

	createMessage = (gameObj, json) => {
		let message = Object.assign({}, json);
	  	message.mode = 2;
	  	message.players_data_count = 15;
	  	message.game_name = gameObj.game;
	  	message.desk_mob = gameObj.desk_mob;
	  	message.dp = gameObj.dp;
	  	message = JSON.stringify(message);
	  	return message;
	}

	loadData = (gameObj, json) => {
		this.setState(() => ({data: null, commonData: null}));
	  	let message = this.createMessage(gameObj, json);
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
	  			console.log(this.state.data);
		    	this.setState(() => ({
	    			playersSpinsData: this.getPlayersSpinsData(this.state.data.interval_mround_data),
	    			currenciesData: this.getCurrenciesData(this.state.data.currency_data),
	    			betRateData: this.getBetRateData(this.state.data.bet_rate_data),
	    			timeIntervalData: this.getIntervalData(this.state.data.int_time_data),
	    			sessionsData: this.getSessionsData(this.state.data.sessions_count_data),
	    			commonData: this.state.data,
	    		}));
	  		})
	  	})
	  	.fail((xhr, status) => {
	  		console.log("%c" + "failed to load one game data", "color: black; font-weight:bold; background-color: Red;");
	  	});
	}

	pressLoad = () => {
		this.props.game.desk_mob = this.state.request.desk_mob;
		this.props.game.dp = this.state.request.dp;
	  	this.loadData(this.props.game, this.state.request);
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

	componentDidMount = () => {
		// this.fetchData();
		this.loadData(this.props.game, this.props.request);
	}

	render() {
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
							<h5>Общие данные</h5>
							<div style={{display: 'flex'}}>
								<CommonTable data={this.state.commonData}  />
								<div style={styles.logo}>
									<LogoCard game={this.props.game}/>
								</div>
							</div>

							<h5 style={{ paddingTop: 25 }}>Анализ количества спинов по игрокам</h5>
							<PlayersSpinsTable data={this.state.playersSpinsData}/>
							<PlayersSpinsChart data={this.state.playersSpinsData}/>

							<h5 style={{ paddingTop: 25 }}>Анализ по валютам</h5>
							<CurrenciesTable data={this.state.currenciesData}/>
							<CurrenciesChart data={this.state.currenciesData}/>

							<h5 style={{ paddingTop: 50 }}>Анализ по ставкам</h5>
							<BetRateTable data={this.state.betRateData}/>
							<BetRateChart data={this.state.betRateData}/>

							<h5 style={{ paddingTop: 25 }}>Посуточная разбивка</h5>
							<TimeIntervalTable data={this.state.timeIntervalData}/>
							<TimeIntervalPlayersChart data={this.state.timeIntervalData}/>
							<TimeIntervalMrChart data={this.state.timeIntervalData}/>

							<h5 style={{ paddingTop: 25 }}>Анализ по сессиям</h5>
							<SessionsTable data={this.state.sessionsData}/>
							<SessionsChart data={this.state.sessionsData}/>
						</>
						
					}
				</div>
			</>
		)
	}
}

export default OneGameStats;