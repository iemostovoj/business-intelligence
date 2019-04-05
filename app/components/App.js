import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import TopTabs from './CenteredTabs';

class App extends React.Component {
	state = {
		data: null,
	}

	render() {
		return (
			<div className="container">
				<TopTabs />
			</div>
		)
	}
}

export default App;