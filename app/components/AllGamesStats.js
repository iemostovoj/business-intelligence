import React from 'react';
import PropTypes from 'prop-types';

import MainTable from './MainTable';
import RequestComposer from './RequestComposer';
import {bi} from './general';

//
class AllGamesStats extends React.Component {
	state = {
		data: null,
		request: {
			"user_name":"e.mostovoy",
			"mode":1,
		},
	}

	loadData = (json) => {
		this.setState(() => ({data: null}));
	  	const message = JSON.stringify(json);
	  	console.log("%c" + message, "color: black; font-weight:bold; background-color: PaleGreen;");
	  	let url = bi.postURL;
	  	const request = $.ajax(
	  	{
	  	    type: "POST",
	  	    url: url,
	  	    data: message,
	  	    timeout: 10000,
	  	})
	  	.done(data => {
	  		this.setState(() => ({data: JSON.parse(data)}), () => {
	  			console.log(this.state.data);
	  		})
	  	})
	  	.fail((xhr, status) => {
	  		console.log("%c" + "failed to load all games data", "color: black; font-weight:bold; background-color: Red;");
	  	});
	}

	pressLoad = () => {
	  	this.loadData(this.state.request);
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

	selectedGamesDispatcher = (selected) => {
		this.props.updateTabs(selected, this.state.request);
	}

	componentDidUpdate = (nextProps, nextState) => {
		this.state.data && sessionStorage.setItem("allGamesData", JSON.stringify(this.state.data));
		nextState.request && nextState.request.date && sessionStorage.setItem("requested", JSON.stringify(nextState.request));
	}

	componentWillMount = () => {
		sessionStorage.getItem("allGamesData") && this.setState({data: JSON.parse(sessionStorage.getItem("allGamesData"))});
		sessionStorage.getItem("requested") && this.setState({request: JSON.parse(sessionStorage.getItem("requested"))});
	}

	render() {
		return (
			<>
				<div className="container text-center" style={{ paddingTop: 25 }}>
					<RequestComposer 
						setRequestData={this.setRequestData} 
						request={this.state.request} 
						loadBtnCallback={this.pressLoad}
					/>
				</div>
				<div className="container text-center" style={{ paddingTop: 10, paddingBottom: 10 }}>
					{!this.state.data 
						? <div>Press LOAD to build the table</div>
						: <MainTable 
							data={this.state.data} 
							dispatchSelectedGames={this.selectedGamesDispatcher} />
					}
				</div>
			</>
		)
	}
}

export default AllGamesStats;