import React, {Component} from 'react';

class Audio extends Component {

  constructor(props) {
    super(props);

    this.state = {currentMusicPlayer: 1};
  }


  componentDidUpdate(oldProps) {
    const newProps = this.props;

    // new audio
    if(newProps.sound && oldProps.sound !== newProps.sound) {
      let player = document.querySelector('#sound-player');
      let source1 = document.querySelector('#sound-source-ogg');
      let source2 = document.querySelector('#sound-source-mp3');
      player.pause();
      source1.src=(`assets/audio/${this.props.sound}.ogg`);
      source2.src=(`assets/audio/${this.props.sound}.mp3`);
      player.load();
      player.play();
    }

    //new music
    if(newProps.music && oldProps.music !== newProps.music) {
      let {currentMusicPlayer} = this.state;
      let {music} = newProps;
      let {preload} = oldProps;

      //stop the current music 
      let player = document.querySelector(`#music-player-${currentMusicPlayer}`);
      player.pause();

      //switch the player (there are 2)
      currentMusicPlayer===1 ? currentMusicPlayer = 2 : currentMusicPlayer = 1;
      player = document.querySelector(`#music-player-${currentMusicPlayer}`);

      // see if the new music has already been preloaded. This can be done to cut down on load time
      if (music!==preload) {
        // if not, load it
        document.querySelector(`#music-${currentMusicPlayer}-source-ogg`).src=(`assets/music/${music}.ogg`);
        document.querySelector(`#music-${currentMusicPlayer}-source-mp3`).src=(`assets/music/${music}.mp3`);
        player.load();
      }
      player.volume=.6;
      player.play();
      this.setState({currentMusicPlayer});
    }

    // new preload 
    if(newProps.preload && oldProps.preload !== newProps.preload) {
      setTimeout(() => {  
        let {preload} = newProps;
        let {currentMusicPlayer} = this.state;
        let backupPlayer = 1;
        if (currentMusicPlayer===1) {
          backupPlayer = 2;
        } 
        let player = document.querySelector(`#music-player-${backupPlayer}`);
        document.querySelector(`#music-${backupPlayer}-source-ogg`).src=(`assets/music/${preload}.ogg`);
        document.querySelector(`#music-${backupPlayer}-source-mp3`).src=(`assets/music/${preload}.mp3`);
        player.load();
      }, 500);
    }
    
  }

  handleFinishAudio = async ()=>{
    await this.props.clearAudio();
    this.props.callback();
  }

  render() {
    return (
      <div style={{display: 'none'}}>

        <audio id="sound-player" onEnded={this.handleFinishAudio}>
          <source id="sound-source-ogg" src='' type="audio/ogg" />
          <source id="sound-source-mp3" src='' type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  

        <audio id="music-player-1" className="music-player" loop >
          <source id="music-1-source-ogg" src='' type="audio/ogg" />
          <source id="music-1-source-mp3" src='' type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
        <audio id="music-player-2" className="music-player" loop >
          <source id="music-2-source-ogg" src='' type="audio/ogg" />
          <source id="music-2-source-mp3" src='' type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
      </div>
    )
  }
}

export default Audio;