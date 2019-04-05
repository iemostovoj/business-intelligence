import React from 'react';
import {Line} from 'react-chartjs-2';
import {bi} from '../general';

class TimeIntervalMrChart extends React.Component {
	displayName = 'TimeIntervalMrChart';

    getData = (data) => {
        return {
            labels: data.map((item) => item.start),
            datasets: [
                {
                    label: 'Количество макрораундов в сутки',
                    data: data.map((item) => item.mr),
                    borderJoinStyle: 'miter',
                    borderColor: bi.bar.bgColor[0],
                    pointBorderColor: bi.bar.bgColor[0],
                    pointBackgroundColor: bi.bar.bgColor[0],
                    pointBorderWidth: 2,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 1,
                    pointRadius: 4,
                    fill: false,
                    backgroundColor: bi.bar.bgColor[0],
                    borderWidth: 2,
                },
            ]
        };
    }

	render() {
		return (
			<div>
                <br/>
				<Line
					data={this.getData(this.props.data)}
				/>
			</div>
		);
	}
}

export default TimeIntervalMrChart;