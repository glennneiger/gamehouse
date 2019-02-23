import React, { Component } from 'react';

import Computer from './components/Computer';
import Device from './components/Device';


class App extends Component {

  constructor(props) {
    super(props);

    this.state={display:''}
  }

  componentDidMount() {
    //screen must be wider than 1000 to be used as display
    window.screen.availWidth < 1000 ? this.setState({display:'device'}) : this.setState({display:'computer'});
  }

  render() {
    if (this.state.display==='computer') {
      return (
        <Computer useAsDevice={()=>this.setState({display:'device'})} />
      )
    } else if (this.state.display==='device') {
      return (
        <Device />
      )
    } else {
      return (
        <div></div>
      )
    }
  }

}

export default App;
