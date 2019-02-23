import React, {Component} from 'react';
import Video from '../../VideoBackground';
import {screens} from './Index';

class Intro extends Component {

  componentDidMount() {
    setTimeout(()=>{ 
      this.props.switchScreen(screens.read);
    }, 5000);
  }

  render() {
    return (
      <Video video='storytime/introxx' />
    )
  }
}

export default Intro;