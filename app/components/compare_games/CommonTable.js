import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import {bi} from '../general';

const styles = theme => ({
    root: {
        marginTop: 10,
        overflowX: 'auto',
    },
    table: {
        width: '100%',
    },
});


class CommonTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    getColumns = (games) => {
        let columns = [];
        columns.push({ id: 'interval', numeric: false, disablePadding: false, label: 'Игра' });
        for (let i = 0; i < games.length; i++) {
            columns.push({id: `${games[i]}_${i}`, numeric: false, disablePadding: false, label: games[i]});
        }
        return columns;
    };

  render() {
    const { order, orderBy, rowCount } = this.props;
    const columns = this.getColumns(this.props.columns);

    return (
      <TableHead>
        <TableRow>
          {columns.map(col => {
            return (
              <TableCell
                key={col.id}
                numeric={col.numeric}
                padding={col.disablePadding ? 'none' : 'dense'}
                sortDirection={orderBy === col.id ? order : false}
                style={{fontSize:"small", color:"blue"}}
              >
                <Tooltip
                  title="Sort"
                  placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={order}
                    onClick={this.createSortHandler(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}
//----CommonTableHead----//
CommonTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};




let id = 0;
function createData(name, value) {
    id += 1;
    return { name, value };
}

class CommonTable extends React.Component {
    getDataObj = (data) => {
        const dateType = {
            d: "(д.)",
            w: "(нед.)",
            m: "(мес.)",
        };

        let obj = {
            game: [],
            date_release: [],
            start: [],
            since_release: [],
            end: [],
            deskmob: [],
            dpnodp: [],
            rounds: [],
            mrounds: [],
            uniq_players: [],
            sessions: [],
            rtp: [],
            recurrence: [],

            av_mr_pl: [],
            av_mr_ses: [],
            av_ses_pl: [],
            av_bet: [],
        };
        if (data.access === "advanced") {
            obj.bets = [],
            obj.wins = [],
            obj.profit = [],
            obj.av_profit_pl = [],
            obj.av_profit_day = [], 
            obj.av_profit_mr = [] 
        }

        let gamesCount = 0;
        for (let key in data) {
            if (!isNaN(key)) {
                gamesCount += 1;
            }
        }

        for (let i = 1; i <= gamesCount; i++) {
            obj.game.push(data[`${i}`].total_data.game);
            obj.date_release.push(data[`${i}`].date.date_release);
            obj.start.push(data[`${i}`].date.start);
            obj.since_release.push(`${data[i+""].date.since_release} ${dateType[data[i+""].date.date_unit]}`);
            obj.end.push(data[`${i}`].date.end);
            obj.deskmob.push(data[`${i}`].total_data.deskmob);
            obj.dpnodp.push(data[`${i}`].total_data.dpnodp);
            obj.rounds.push(data[`${i}`].total_data.rounds);
            obj.mrounds.push(data[`${i}`].total_data.mrounds);
            obj.uniq_players.push(data[`${i}`].total_data.uniq_players);
            obj.sessions.push(data[`${i}`].total_data.sessions);
            obj.rtp.push(data[`${i}`].total_data.rtp);
            obj.recurrence.push(data[`${i}`].total_data.recurrence);
            // obj.currency_data.push(Object.keys(data[i+""].currency_data).length);
            obj.av_mr_pl.push(data[`${i}`].total_data.av_mr_pl);
            obj.av_mr_ses.push(data[`${i}`].total_data.av_mr_ses);
            obj.av_ses_pl.push(data[`${i}`].total_data.av_ses_pl);
            obj.av_bet.push(data[`${i}`].total_data.av_bet);
            if (data.access === "advanced") {
                obj.bets.push(data[`${i}`].total_data.advanced.bets);
                obj.wins.push(data[`${i}`].total_data.advanced.wins);
                obj.profit.push(data[`${i}`].total_data.advanced.profit);
                obj.av_profit_pl.push(data[`${i}`].total_data.advanced.av_profit_pl);
                obj.av_profit_day.push(data[`${i}`].total_data.advanced.av_profit_day);
                obj.av_profit_mr.push(data[`${i}`].total_data.advanced.av_profit_mr);
            }
        }

        obj.access = data.access;
        return obj;
    }

    getRows = (data) => {
        let rows = [
            createData(bi.table.labels.game, data.game),
            createData(bi.table.labels.date_release, data.date_release),
            createData('Дата начала сбора данных', data.start),
            createData('Пропущено с дня релиза', data.since_release),
            createData('Дата окончания сбора данных', data.end),
            createData(bi.table.labels.deskmob, data.deskmob),
            createData(bi.table.labels.dpnodp, data.dpnodp),
            createData(bi.table.labels.rounds, data.rounds),
            createData(bi.table.labels.mrounds, data.mrounds),
            createData(bi.table.labels.uniq_players, data.uniq_players),
            createData(bi.table.labels.sessions, data.sessions),
            createData(bi.table.labels.rtp, data.rtp),
            createData(bi.table.labels.recurrence, data.recurrence),
            /*createData('Количество валют', data.currency_data),*/
            createData(bi.table.labels.av_mr_pl, data.av_mr_pl),
            createData(bi.table.labels.av_mr_ses, data.av_mr_ses),
            createData(bi.table.labels.av_ses_pl, data.av_ses_pl),
            createData(bi.table.labels.av_bet, data.av_bet)
        ];
        if (data.access === "advanced") {
            rows.push(createData(bi.table.labels.bets, data.bets));
            rows.push(createData(bi.table.labels.wins, data.wins));
            rows.push(createData(bi.table.labels.profit, data.profit));
            rows.push(createData(bi.table.labels.av_profit_pl, data.av_profit_pl));
            rows.push(createData(bi.table.labels.av_profit_day, data.av_profit_day));
            rows.push(createData(bi.table.labels.av_profit_mr, data.av_profit_mr));
        }

        return rows;
    }

    getRowsFromRawData = (data) => {
        let rows = [];
        for (let i = 0; i < data.length; i++) {
            let obj = {};
            obj.name = data[i].name;
            const value = data[i].value;
            for (let v = 0; v < value.length; v++) {
                obj[`result_${v+1}`] = value[v];
            }
            rows.push(obj);
        }

        return rows;
    }

    getColumnsFromRawData = (data) => {
        const names = data.shift();
        return names.value;
    }

    rawData = this.getRows(this.getDataObj(this.props.data));

    state = {
        columns: this.getColumnsFromRawData(this.rawData),
        rows: this.getRowsFromRawData(this.rawData),
        order: 'asc',
        orderBy: 'name',
        page: 0,
        rowsPerPage: 10,
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    render() {
        const { classes } = this.props;
        const { rows, columns, order, orderBy, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

        return (

            <Paper className={classes.root} style={{ marginLeft: 15 }}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        {<CommonTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rowCount={rows.length}
                            columns={columns}
                        />}
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const fields = Object.keys(n);
                                    const cells = fields.map(field => (
                                        <TableCell 
                                            key={field + Math.random()} 
                                            numeric={false}>
                                                {n[field]}
                                        </TableCell>
                                    ));
                                    return (
                                      <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={Math.random()}
                                      >
                                        {cells}
                                      </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>

        );
    }
    
}

CommonTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommonTable);