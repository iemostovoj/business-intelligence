import React from 'react';
import {Bar} from 'react-chartjs-2';
import {bi} from '../general';

class BetRateChart extends React.Component {
	displayName = 'BetRateChart';

    getData = (data) => {
        return {
            labels: data.map((item) => item.min_max),
            datasets: [
                {
                    label: 'Размеры ставок (%)',
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

export default BetRateChart;