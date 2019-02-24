import React, {Component} from 'react';
import Video from '../../VideoBackground';
import {screens} from './helpers';

class Read extends Component {

   componentDidMount() {
     this.read();
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
    const {turn} = this.props;
    if (turn===0) {
      setTimeout(()=>{ 
        this.props.switchScreen(screens.next);
      }, 4000);
    }
  }

  render() {
    return (
      <div className="StoryTime">
        <Video video={`storytime/bg0${this.props.turn % 3}`} />
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