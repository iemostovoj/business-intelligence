import React from 'react';
import {Pie} from 'react-chartjs-2';
import {bi} from '../general';

class CurrenciesChart extends React.Component {
	displayName = 'CurrenciesChart';

    getData = (data) => {
        return {
            labels: data.map((item) => item.currency),
            datasets: [
                {
                    data: data.map((item) => item.mr),
                    backgroundColor: bi.bar.bgColor,
                    hoverBackgroundColor: bi.bar.hoverBgColor
                },
            ]
        };
    }

	render() {
		return (
			<div>
                <br/>
				<Pie
					data={this.getData(this.props.data)}
                    height={100}
				/>
			</div>
		);
	}
}

export default CurrenciesChart;