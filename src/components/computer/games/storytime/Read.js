import React, {Component} from 'react';
import {screens} from './helpers';

class Read extends Component {

  constructor(props) {
    super(props);
    this.state = {reading: false};
  }

  componentDidMount() {
    this.props.playVideo('storytime/bg0' + this.props.turn % 3);
    if (!this.state.reading) {
      this.read();
      this.setState({reading:true});
    }
  }


  read = ()=> {
    const speaker = {
      "name": "Alex",
      "lang": "en-US"
    }

    let msg = new SpeechSynthesisUtterance();

    msg.volume = 1; // 0 to 1
    msg.rate = 1.1; // 0.1 to 10
    msg.pitch = 1.5; // 0 to 2
    msg.text  = this.props.story;
    const voice = speaker;
    msg.voiceURI = voice.name;
    msg.lang = voice.lang;
    speechSynthesis.speak(msg);  

    var _wait =()=> {
      if ( ! window.speechSynthesis.speaking ) {
        this.handleFinishReading();
        return;
      }
      window.setTimeout( _wait, 200 );
    }
    _wait();
  }

  handleFinishReading = ()=> {
    this.setState({reading:false});
    let {turn} = this.props;
    let interval = 0;
    if (turn===0) {
      this.props.playVoice('01');
      interval = 6000;
    }

    setTimeout(()=>{ 
      this.props.switchScreen(screens.next);
    }, interval);

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