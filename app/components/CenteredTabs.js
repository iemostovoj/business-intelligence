import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import AllGamesStats from './AllGamesStats';
import OneGameStats from './OneGameStats';
import CompareGameStats from './CompareGameStats';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class CenteredTabs extends React.Component {
  state = {
    value: 0,
    selected: [],
    request: null,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  updateTabsHandler = (selected, request) => {
    this.setState({ selected, request }, () => {
      // console.log("selected: ");
      // console.log(selected);
      // console.log("request: ");
      // console.log(request)
    });

  };

  componentDidUpdate = (prevProps, prevState) => {
    // очищаем запрос на выбранную игру
    if (this.state.value === 0 && prevState.value === 1) {
        this.setState({
            selected: [],
            request: null,
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Анализ по играм" />
          <Tab label="Данные по одной игре"  disabled={this.state.selected.length == 0}/>
          <Tab label="Сравнительный анализ игр" disabled={this.state.selected.length < 2}/>
        </Tabs>
      <Divider variant="middle" />
      {value === 0 && <AllGamesStats updateTabs={this.updateTabsHandler} />}
      {value === 1 && <OneGameStats game={this.state.selected[0]} request={this.state.request} />}
      {value === 2 && <CompareGameStats games={this.state.selected} request={this.state.request} />}
      </Paper>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenteredTabs);