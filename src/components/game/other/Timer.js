import React, {Component} from 'react';

import {updateRoom} from '../../../actions/index';

export default class Timer extends Component {

  constructor(props) {
    super(props);
    
    this.progressBarInterval = null;
    this.countdownInterval = null;

    this.state = {
      startTimer: null, 
      secondsRemaining: null
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.startTimer===this.props.startTimer) return;

    if (this.props.startTimer && !this.state.startTimer) {
      this.setState({startTimer: true});
      this.startTimer();
    } else if (!this.props.startTimer && this.state.startTimer) {
      this.stopTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this.progressBarInterval);
    clearInterval(this.countdownInterval);
  }

  stopTimer = ()=> {
    clearInterval(this.progressBarInterval);
    clearInterval(this.countdownInterval);
    updateRoom(this.props.code, {timer: 0});
    this.setState({startTimer: false});
    document.querySelector('.Timer').style.display="none";
  }

  startTimer = ()=> {
    const seconds = this.props.seconds || 60;
    const {code}=this.props;

    this.setState({secondsRemaining: seconds});

    let timer = document.getElementById('timer');
    timer.style.width="100vw";
    timer.style.backgroundColor="#44cc44";
    timer.parentElement.style.display="block";

    let width = 100;
    updateRoom(code, {timer: seconds});

    this.countdownInterval = setInterval(()=>{
      let {secondsRemaining} = this.state;
      secondsRemaining--;
      updateRoom(code, {timer: secondsRemaining});
      this.setState({secondsRemaining});
    }, 1000);
    
    this.progressBarInterval = setInterval(()=>{
      width-=0.1;
      timer.style.width=`${width}vw`;
      if (parseInt(width)===50) {
        timer.style.backgroundColor="#eedd44";
      }
      if (parseInt(width)===35) {
        timer.style.backgroundColor="orange";
      }
      if (parseInt(width)===20) {
        timer.style.backgroundColor="red";
      }
      if (width < .2) {
        this.stopTimer();
        const doNothing = ()=>{return};
        const onFinish = this.props.onFinish || doNothing; 
        onFinish();
      }
    }, seconds);

  }

  render() {
    return(
      <div className="Timer"><div id="timer"></div></div>
    )
  }
}