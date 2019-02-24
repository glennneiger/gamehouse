import React, {Component} from 'react';
import Video from '../../VideoBackground';
import {screens} from './helpers';

class Intro extends Component {

  componentDidMount() {
    setTimeout(()=>{ 
      this.props.switchScreen(screens.read);
    }, 5000);
  }

  render() {
    return (
      <Video video='storytime/intro' />
    )
  }
}

export default Intro;