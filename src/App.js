import React, { Component } from 'react';

import Computer from './components/Computer';
import Device from './components/Device';


class App extends Component {

  constructor(props) {
    super(props);

    this.state={display:''}
  }

  componentDidMount() {
    //mobile devices will automatically be shown as device
    if ((typeof window.orientation !== "undefined" && window.screen.availWidth < 1000) || navigator.userAgent.indexOf('IEMobile') !== -1 || window.screen.availWidth < 900 ) { // Fire TV is 960 width
      this.setState({display:'device'}); 
    } else { 
      this.setState({display:'computer'}); 
    }
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
