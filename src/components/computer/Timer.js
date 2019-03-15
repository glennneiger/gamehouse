import React, {Component} from 'react';



export default class Timer extends Component {

  constructor(props) {
    super(props);
    
    this.clock = null;
    this.state = {startTimer: false}
  }


  componentDidUpdate() {
    if (this.props.startTimer && !this.state.startTimer) {
      this.setState({startTimer: true});
      this.startTimer();
    } else if (!this.props.startTimer && this.state.startTimer) {
      this.stopTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  stopTimer = ()=> {
    clearInterval(this.clock);
    this.setState({startTimer: false});
    document.querySelector('.Timer').style.display="none";
  }

  startTimer = ()=> {
    let timer = document.getElementById('timer');
    timer.style.width="100vw";
    timer.style.backgroundColor="#44cc44";
    timer.parentElement.style.display="block";

    let width = 100;
    const seconds = this.props.seconds || 30;
    const interval = seconds;

    
    this.clock = setInterval(()=>{
      width-=0.1;
      timer.style.width=`${width}vw`;
      if (parseInt(width)===50) {
        timer.style.backgroundColor="#ccbb44";
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
    }, interval);

  }

  render() {
    return(
      <div className="Timer"><div id="timer"></div></div>
    )
  }
}