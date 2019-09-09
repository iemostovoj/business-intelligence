const bi = {
	postURL: 'http://bi-dzento-int-lxc.dzento.com:8080',
	func: {
		desc: (a, b, orderBy) => {
			if (b[orderBy] < a[orderBy]) {
				return -1;
			}
			if (b[orderBy] > a[orderBy]) {
				return 1;
			}
			return 0;
		},
		stableSort: (array, cmp) => {
			const stabilizedThis = array.map((el, index) => [el, index]);
			stabilizedThis.sort((a, b) => {
				const order = cmp(a[0], b[0]);
				if (order !== 0) return order;
				return a[1] - b[1];
			});
			return stabilizedThis.map(el => el[0]);
		},
		getSorting: (order, orderBy) => {
			return order === 'desc' ? (a, b) => bi.func.desc(a, b, orderBy) : (a, b) => -bi.func.desc(a, b, orderBy);
		},
		getColumnsCount: (data) => {
			/* находим макс. кол-во месяцев для столбцов таблицы */
		    return data.map(item => item.count).sort((a, b) => b - a)[0];
		},
	},
	bar: {
		bgColor: [
			'rgba(153, 0, 0, 0.85)', 'rgba(153, 153, 0, 0.85)', 'rgba(0, 153, 0, 0.85)',
			'rgba(0, 153, 153, 0.85)', 'rgba(0, 0, 153, 0.85)', 'rgba(153, 0, 153, 0.85)',
			'rgba(64, 64, 64, 0.85)', 'rgba(153, 76, 0, 0.85)', 'rgba(76, 153, 0, 0.85)',
			'rgba(0, 153, 76, 0.85)', 'rgba(0, 76, 153, 0.85)', 'rgba(76, 0, 153, 0.85)',
			'rgba(153, 0, 76, 0.85)', 'rgba(255, 0, 0, 0.85)', 'rgba(255, 255, 0, 0.85)',
			'rgba(0, 255, 0, 0.85)', 'rgba(0, 255, 255, 0.85)', 'rgba(0, 0, 255, 0.85)',
			'rgba(255, 0, 255, 0.85)', 'rgba(128, 128, 128, 0.85)', 'rgba(255, 128, 0, 0.85)',
			'rgba(128, 255, 0, 0.85)', 'rgba(0, 255, 128, 0.85)', 'rgba(0, 128, 255, 0.85)',
			'rgba(128, 0, 255, 0.85)', 'rgba(255, 0, 128, 0.85)', 'rgba(255, 153, 153, 0.85)',
			'rgba(255, 255, 153, 0.85)', 'rgba(153, 255, 153, 0.85)', 'rgba(153, 255, 255, 0.85)',
			'rgba(153, 153, 255, 0.85)', 'rgba(255, 153, 255, 0.85)', 'rgba(224, 224, 224, 0.85)',
		],
		hoverBgColor: [
			'rgba(153, 0, 0, 1)', 'rgba(153, 153, 0, 1)', 'rgba(0, 153, 0, 1)',
			'rgba(0, 153, 153, 1)', 'rgba(0, 0, 153, 1)', 'rgba(153, 0, 153, 1)',
			'rgba(64, 64, 64, 1)', 'rgba(153, 76, 0, 1)', 'rgba(76, 153, 0, 1)',
			'rgba(0, 153, 76, 1)', 'rgba(0, 76, 153, 1)', 'rgba(76, 0, 153, 1)',
			'rgba(153, 0, 76, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 255, 0, 1)',
			'rgba(0, 255, 0, 1)', 'rgba(0, 255, 255, 1)', 'rgba(0, 0, 255, 1)',
			'rgba(255, 0, 255, 1)', 'rgba(128, 128, 128, 1)', 'rgba(255, 128, 0, 1)',
			'rgba(128, 255, 0, 1)', 'rgba(0, 255, 128, 1)', 'rgba(0, 128, 255, 1)',
			'rgba(128, 0, 255, 1)', 'rgba(255, 0, 128, 1)', 'rgba(255, 153, 153, 1)',
			'rgba(255, 255, 153, 1)', 'rgba(153, 255, 153, 1)', 'rgba(153, 255, 255, 1)',
			'rgba(153, 153, 255, 1)', 'rgba(255, 153, 255, 1)', 'rgba(224, 224, 224, 1)',
		],
		getRandomRGBa: () => {
		    let random256 = () => Math.floor(Math.random() * 256);
		    return `rgba(${random256()}, ${random256()}, ${random256()}, 1)`;
		}
	},
	table: {
		labels: {
            game: "Игра",
            deskmob: "Desk / Mob",
            dpnodp: "DP/ NoDP",
            mrounds: "Макрораундов",
            rounds: "Раундов",
            percent_freerounds: "% фриспинов",
            uniq_players: "Уникальных игроков",
            sessions: "Сессий",
            rtp: "% RTP",
            recurrence: "% Вернувшихся",
            recurrence2: "% Вернувшихся_2",
            av_mr_pl: "Сред. макрораундов на игрока",
            av_mr_ses: "Сред. макрораундов за сессию",
            av_ses_pl: "Сред. сессий на игрока",
            av_bet: "Сред. ставка",
            bets: "Ставок",
            wins: "Выигрышей",
            profit: "Профит",
            av_profit_pl: "Сред. профит с игрока",
            av_profit_day: "Сред. профит за день",
            av_profit_mr: "Сред. профит за макрораунд",

            date_release: "Дата релиза",
            total_profit: "Общий профит",
        }
	}
};

export { bi };