import React, {Component} from 'react';
import {screens, read} from './helpers';

class Read extends Component {

  constructor(props) {
    super(props);
    this.state = {reading: false};
  }

  componentDidMount() {
    const {story, turn} = this.props;

    let vidIndex = 0;
    
    if (turn===2) { 
      this.props.playAudio('music', 'storytime/1');
      this.props.preloadMusic('storytime/2');
    } else if (turn===5) { 
      this.props.playAudio('music', 'storytime/2');
      this.props.preloadMusic('storytime/3');
      vidIndex = 1;
    } else if (turn===7) {
      this.props.playAudio('music', 'storytime/3');
      this.props.preloadMusic('storytime/final');
      vidIndex = 2;
    }

    this.props.playVideo('storytime/read0' + vidIndex);
    this.props.preloadVideo('storytime/next');
    if (!this.state.reading) {
      read(story, this.handleFinishReading);
      this.setState({reading:true});
    }
  }

  handleFinishReading = ()=> {
    this.setState({reading:false});
    let {turn} = this.props;

    if (turn===0 || turn===7) {
      this.props.playVoice(`read/${turn}`, this.nextScreen);
    } else {
      this.nextScreen();
    }
  }

  nextScreen = ()=> {
    this.props.switchScreen(screens.next);
  }

  render() {
    return (
      <div className="StoryTime">
        <div className="center-screen">
          <div className="story-text">
            {this.props.story}
          </div>
        </div>
      </div>
    )
  }
}

export default Read;