import React from 'react';
import {Bar} from 'react-chartjs-2';
import {bi} from '../general';

class AvSpinsPerSessionChart extends React.Component {
	displayName = 'AvSpinsPerSessionChart';

    getData = (data) => {
        return {
            labels: data.map((item) => item.game),
            datasets: [
                {
                    label: 'Среднее количество спинов за сессию',
                    backgroundColor: bi.bar.bgColor,
                    borderWidth: 0,
                    hoverBackgroundColor: bi.bar.hoverBgColor,
                    data: data.map((item) => item.av_mr_ses)
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

export default AvSpinsPerSessionChart;