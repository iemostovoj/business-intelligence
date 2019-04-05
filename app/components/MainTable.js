import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {bi} from './general';

class MainTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
    const rows = this.props.columnNames;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              color="primary"
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                  style={{fontSize:"larger"}}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
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
//----MainTableHead----//
MainTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnNames: PropTypes.array.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 5,
  },
  table: {
    minWidth: 1280,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const cellsTemplate = {
    date: ["type", "date_unit", "start", "end", "date_release", "since_release"],
    total_data: ["game", "deskmob", "dpnodp", "mrounds", "rounds", "percent_freerounds", "uniq_players", 
        "sessions", "rtp", "recurrence", "recurrence2", "av_mr_pl", "av_mr_ses", "av_ses_pl", "av_bet", 
        /*advanced section:*/
        "bets", "wins", "profit", "av_profit_pl", "av_profit_day", "av_profit_mr"],
};

class MainTable extends React.Component {
    applyTemplate = (currentOrder) => {
        let newOrder = [];
        for (let i = 0, length = currentOrder.length; i < length; i++) {
            let obj = currentOrder.filter(item => item.id == cellsTemplate.total_data[i])[0];
            newOrder.push(obj);
        }
        return newOrder;
    };

	getColumnNames = () => {
        // console.log(this.props.data);
    	let obj = this.props.data["1"].total_data;
    	let names = [];
        let labels = {
            game: "Игра",
            deskmob: "Desk / Mob",
            dpnodp: "DP/ NoDP",
            mrounds: "Макрораундов",
            rounds: "Раундов",
            percent_freerounds: "% фриспинов",
            uniq_players: "Уникальных игроков",
            sessions: "Сессий",
            rtp: "RTP",
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
        };

        for (let key in obj) {
            if (typeof obj[key] !== "object") {
                names.push({
                    id: key, 
                    numeric: typeof obj[key] === "number", 
                    disablePadding: false, /*key !== "name",*/ 
                    label: labels[key] ? labels[key] : key,
                });
            } else if (key === this.props.data.access) {
                let advanced = obj[key];
                for (let k in advanced) {
                    names.push({
                        id: k, 
                        numeric: typeof advanced[k] === "number", 
                        disablePadding: false,  
                        label: labels[k] ? labels[k] : k,
                    });
                }
            }
        }
        return this.applyTemplate(names);
    };

    getRows = (rawData) => {
        let games = [];
        for (let key in rawData) {
            if (Number(key) || key === "0") {
                games.push(rawData[key]);
            }
        }

        let data = games.map((game, index) => {
            let row = {};
            row.id = ++index;
            for (let i = 0; i < this.columnNames.length; i++) {
                let key = this.columnNames[i].id;
                row[key] = this.props.data.access === "advanced" && game.total_data.advanced[key]
                    ? game.total_data.advanced[key]
                    : game.total_data[key];
            }
            return row;
        });

        return data;
    };

	columnNames = this.getColumnNames();

  state = {
    order: 'asc',
    orderBy: 'name',
    selected: [],
    rows: this.getRows(this.props.data),
    page: 0,
    rowsPerPage: 5,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.rows.map(n => n.id) }), () => {
        let games = this.state.rows.map(row => {
              let obj = {};
              obj.game = row.game;
              obj.desk_mob = row.deskmob;
              obj.dp = row.dpnodp;
              return obj;
            });
        this.props.dispatchSelectedGames(games);
      });
      return;
    }
    this.setState({ selected: [] });
    this.props.dispatchSelectedGames([]);
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected }, () => {
        let games = this.state.rows
            .filter((row) => newSelected.indexOf(row.id) > -1)
            .map((row) => {
              let obj = {};
              obj.game = row.game;
              obj.desk_mob = row.deskmob;
              obj.dp = row.dpnodp;
              return obj;
            });
        this.props.dispatchSelectedGames(games);
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  componentWillReceiveProps = () => {
    // console.warn(this.props.data);
  }

  render() {
    const { classes } = this.props;
    const { rows, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <MainTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={rows.length}
              columnNames={this.columnNames}
            />
            <TableBody>
              {bi.func.stableSort(rows, bi.func.getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  const fields = Object.keys(n);
                  fields.shift();
                  const cells = fields.map(field => (
                    <Tooltip
                      title={n.game.toUpperCase()}
                      placement={'bottom-start'}
                      enterDelay={200}
                      key={Math.random()} 
                    >
                    	<TableCell 
                    		key={field + Math.random()} 
                    		numeric={typeof n[field] === "number"}
                        style={field == "game" ? {fontSize:"medium", color:"blue"} : {fontSize:"small"}}
                      >
                    		{n[field]}
                    	</TableCell>
                    </Tooltip>
                  ));
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} color="primary" />
                      </TableCell>
                      {cells}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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

MainTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainTable);
