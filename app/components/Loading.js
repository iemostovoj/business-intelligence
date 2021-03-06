import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  content: {
    textAlign: 'left',
    fontSize: '18px'
  }
}

class Loading extends React.Component {
    static propTypes = {
      text: PropTypes.string.isRequired,
      speed: PropTypes.number.isRequired,
    }

    static defaultProps = {
      text: 'Loading',
      speed: 150
    }

    state = {
      text: this.props.text,
      speed: this.props.speed
    }

    componentDidMount() {
      const {text, speed} = this.props;
      const stopper = `${text}■■■■■`;
      this.interval = window.setInterval(() => {
        this.state.text === stopper 
          ? this.setState(() => ({text}))
          : this.setState((prevState) => ({text: prevState.text + '■'}))
      }, speed);
    }

    componentWillUnmount() {
      window.clearInterval(this.interval);
    }

    render() {
        return (
          <p style={styles.content}>
            {this.state.text}
          </p>
        )
    }
}

export default Loading;