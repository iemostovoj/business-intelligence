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

class SessionsAndReccurenciesTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    columns = [
        { id: 'game', numeric: false, disablePadding: false, label: 'Игра' },
        { id: 'av_ses_pl', numeric: true, disablePadding: false, label: 'Среднее кол-во сессий' },
        { id: 'av_mr_ses', numeric: true, disablePadding: false, label: 'Среднее кол-во спинов за сессию' },
        { id: 'recurrence', numeric: true, disablePadding: false, label: 'Возвращаемость новых игроков' },
        { id: 'recurrence2', numeric: true, disablePadding: false, label: 'Возвращаемость существующих игроков' },
    ];

  render() {
    const { order, orderBy, rowCount } = this.props;
    const columns = this.columns;

    return (
      <TableHead>
        <TableRow>
          {columns.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
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
//----SessionsAndReccurenciesTableHead----//
SessionsAndReccurenciesTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


class SessionsAndReccurenciesTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'name',
        rows: this.props.data,
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

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

  render() {
    const { classes } = this.props;
    const { rows, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
      <Paper className={classes.root} style={{ marginLeft: 15 }}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <SessionsAndReccurenciesTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {bi.func.stableSort(rows, bi.func.getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const fields = Object.keys(n);
                  fields.shift();
                  const cells = fields.map(field => (
                  	<TableCell 
                  		key={field + Math.random()} 
                  		numeric={typeof n[field] === "number"}>
                  			{n[field]}
                  	</TableCell>
                  ));
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={n.id}
                    >
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

SessionsAndReccurenciesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SessionsAndReccurenciesTable);
