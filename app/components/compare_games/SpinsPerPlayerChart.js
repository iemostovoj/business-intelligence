import React from 'react';
import {Line} from 'react-chartjs-2';
import {bi} from '../general';

class SpinsPerPlayerChart extends React.Component {
	displayName = 'SpinsPerPlayerChart';

    getXLabels = (data) => {
        const dateType = this.props.dateInfo.date.type;
        let arr;

        // находим макс. кол-во месяцев для графика
        let max = data.map(item => item.count).sort((a, b) => b - a)[0];
        if (dateType === "rel") {
            // генерируем массив [1,.. max]
            arr = Array.from(Array(max + 1).keys());
            arr.shift();
        } else {
            arr = [];
            for (var i = 1; i <= max; i++) {
                arr.push(this.props.dateInfo["1"].int[`${i}`].start);
            }
        }
        
        return arr;
    };

    getDataSets = (data) => {
        let dataSet = [];
        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            let points = [];
            for (let i = 1; i <= obj.count; i++) {
                let num = obj[`date_${i}`];
                // нормализация
                if (typeof num == "number" && this.props.normalized) {
                    num = ((num / obj.normValue).toFixed(3)) % 1000;
                }
                points.push(num);
            }

            dataSet.push({
                label: obj.game,
                data: points,
                borderJoinStyle: 'miter',
                borderColor: bi.bar.bgColor[i],
                pointBorderColor: bi.bar.bgColor[i],
                pointBackgroundColor: bi.bar.bgColor[i],
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 1,
                pointRadius: 4,
                fill: false,
                backgroundColor: bi.bar.bgColor[i],
                borderWidth: 2,
            });
        }
        return dataSet;
    };

    getData = (data) => {
        return {
            labels: this.getXLabels(data),
            datasets: this.getDataSets(data),
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

export default SpinsPerPlayerChart;