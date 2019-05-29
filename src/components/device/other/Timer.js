import React, {Component} from 'react';

import {watchForChange, removeWatcher, getValue} from '../../../actions/index';

export default class Timer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      seconds: null
    }
  }

  componentDidMount = async ()=> {
    const seconds = await getValue(this.props.code, 'timer');
    this.setState({seconds});
    watchForChange(this.props.code, 'timer', this.updateTimer, true);
  }

  componentWillUnmount() {
    removeWatcher(this.props.code, 'timer');
  }

  updateTimer = seconds => {
    if (seconds!==null) {
      this.setState({seconds});
      if (seconds===0 && this.props.onFinish) {
        this.props.onFinish();
      }
    }
  }

  render() {

    const seconds = this.state.seconds;
    let color = '#00a000';
    if (seconds <= 12 && seconds > 7) {
      color = '#c9c300'
    } else if (seconds && seconds <= 7) {
      color = '#aa3300';
    }

    return <div className="DeviceTimer row"><div className="circle" style={{'backgroundColor':color}}>{(seconds && seconds > 0) ? seconds-1 : 0}</div></div>

  }
}