import React, {Component} from 'react';

class Audio extends Component {
  render() {
    return (
      <div style={{display: 'none'}}>
        <audio id="soundPlayer">
          <source src={`assets/audio/${this.props.sound}.ogg`} type="audio/ogg" />
          <source src={`assets/audio/${this.props.sound}.mp3`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
        <audio id="musicPlayer">
          <source src={`assets/audio/music/${this.props.music}.ogg`} type="audio/ogg" />
          <source src={`assets/audio/music/${this.props.music}.mp3`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
      </div>
    )
  }
}

export default Audio;