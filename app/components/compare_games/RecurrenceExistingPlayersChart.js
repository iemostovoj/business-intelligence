import React from 'react';
import {Bar} from 'react-chartjs-2';
import {bi} from '../general';

class RecurrenceExistingPlayersChart extends React.Component {
	displayName = 'RecurrenceExistingPlayersChart';

    getData = (data) => {
        return {
            labels: data.map((item) => item.game),
            datasets: [
                {
                    label: 'Возвращаемость существующих игроков (%)',
                    backgroundColor: bi.bar.bgColor,
                    borderWidth: 0,
                    hoverBackgroundColor: bi.bar.hoverBgColor,
                    data: data.map((item) => item.recurrence2)
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
                    width={100}
                    height={350}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                maxBarThickness: 40,
                            }],
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                }
                            }]
                        }
                    }}
                />
			</div>
		);
	}
}

export default RecurrenceExistingPlayersChart;