import React from 'react';
import {Bar} from 'react-chartjs-2';
import {bi} from '../general';

class SessionsChart extends React.Component {
	displayName = 'SessionsChart';

    getData = (data) => {
        return {
            labels: data.map((item) => item.sessions),
            datasets: [
                {
                    label: 'Количество сессий на 1 игрока (в %)',
                    backgroundColor: bi.bar.bgColor[0],
                    borderWidth: 0,
                    hoverBackgroundColor: bi.bar.hoverBgColor[0],
                    data: data.map((item) => item.percent)
                },
            ]
        };
    }

	render() {
		return (
			<div>
                <br/>
				<Bar
					data={this.getData(this.props.data)}
					width={10}
					height={400}
					options={{
						maintainAspectRatio: false
					}}
				/>
			</div>
		);
	}
}

export default SessionsChart;