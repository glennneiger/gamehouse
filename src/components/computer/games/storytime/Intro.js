import React, {Component} from 'react';
import {screens} from './helpers';

class Intro extends Component {

  constructor(props) {
    super(props);
    this.state = {timerSet: false};
  }

  componentDidMount() {
    if (!this.state.timerSet) {
      setTimeout(()=>{ 
        this.props.switchScreen(screens.read);
      }, 1000);
      this.setState({timerSet:true});
    }
  }
  
  render() {
    return (
      <div></div>
    )
  }
}

export default Intro;