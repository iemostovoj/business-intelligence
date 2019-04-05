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

class SpinsPerPlayerTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    getColumns = (games) => {
        let columns = [];
        columns.push({ id: 'interval', numeric: false, disablePadding: false, label: 'Интервал' });
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
                padding={col.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === col.id ? order : false}
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
//----SpinsPerPlayerTableHead----//
SpinsPerPlayerTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


class SpinsPerPlayerTable extends React.Component {
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
            <SpinsPerPlayerTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={rows.length}
              columns={this.state.rows.games}
            />
            <TableBody>
              {bi.func.stableSort(rows, bi.func.getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                    const fields = Object.keys(n);
                    fields.pop();
                    const cells = fields.map(field => {
                        let cell = n[field];
                        // нормализация, сэр!
                        if (typeof cell == "number" && this.props.normalized) {
                            let index = field.substr(field.indexOf("_") + 1) - 1;
                            cell = (cell / rows.normValues[index]).toFixed(3) % 1000;
                        }
                        return (
                        <TableCell key={field + Math.random()} numeric={false}>
                            {cell}
                        </TableCell>
                    )});
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={n.id}>
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

SpinsPerPlayerTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpinsPerPlayerTable);
