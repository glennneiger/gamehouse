import React, {Component} from 'react';

class Video extends Component {

  /*
  Props:
    videos: array,
    musics: array,
    audios: array,
    folder: string
    curVideo: string,
    curMusic: string,
    curAudio: string
    handleFinishLoading: function
  */

  constructor(props) {
    super(props);
    this.state = {
      videoPlayers: [],
      musicPlayers: [],
      audioPlayers: []
    }
  }


  componentDidUpdate(oldProps) {
    const {folder, curVideo, curAudio, curMusic} = this.props;

    // new folder
    if (folder !== oldProps.folder) {
      this.loadFiles();
      return;
    }

    // play video
    if (curVideo && curVideo !== oldProps.curVideo) {
      if (oldProps.curVideo) {
        let oldPlayer = document.getElementById(`vid-${folder}-${oldProps.curVideo}`);
        if (oldPlayer) oldPlayer.style.display = 'none';
      }
      let player = document.getElementById(`vid-${folder}-${curVideo}`);
      if (player) {
        player.style.display = 'block';
        player.play();
      }
    }

    // play music
    if (curMusic && curMusic !== oldProps.curMusic) {
      if (oldProps.curMusic) {
        let oldPlayer = document.getElementById(`music-${folder}-${oldProps.curMusic}`);
        if (oldPlayer) oldPlayer.stop();
      }
      let player = document.getElementById(`music-${folder}-${curMusic}`);
      if (player) {
        player.play();
      }
    }

    // play audio
    if (curAudio && curAudio !== oldProps.curAudio) {
      let player = document.getElementById(`audio-${folder}-${curAudio}`);
      if (player) {
        player.play();
      }
    }


  }

  loadFiles = () => {
    this.setState({videoPlayers: [], musicPlayers: [], audioPlayers: []});

    const {videos, musics, audios} = this.props;
    let needToLoad = videos.length + musics.length + audios.length;

    let videoPlayers = [];
    let musicPlayers = [];
    let audioPlayers = [];
    

    const finishLoadingFile = ()=> {
      needToLoad--;
      if (!needToLoad) {
        this.props.handleFinishLoading();
      }
    }

    const {folder} = this.props;

    videos.forEach(file => {
      videoPlayers.push(
        <video key={`${folder}-${file}`} id={`vid-${folder}-${file}`} style={{'display':'none'}} className="bg-video" loop muted onLoadedData={finishLoadingFile}>
          <source src={`assets/video/${folder}/${file}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    });

    musics.forEach(file => {
      musicPlayers.push(
        <audio key={`${folder}-${file}`} id={`music-${folder}-${file}`} className="music-player" loop onLoadedData={finishLoadingFile}>
          <source src={`assets/music/${folder}/${file}.ogg`} type="audio/ogg" />
          <source src={`assets/music/${folder}/${file}.mp3`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
      )
    });

    audios.forEach(file => {
      audioPlayers.push(
        <audio key={`${folder}-${file}`} id={`audio-${folder}-${file}`} className="audio-player" onLoadedData={finishLoadingFile} onEnded={this.handleFinishAudio}>
          <source src={`assets/audio/${folder}/${file}.ogg`} type="audio/ogg" />
          <source src={`assets/audio/${folder}/${file}.mp3`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
      )
    });

    this.setState({videoPlayers, musicPlayers, audioPlayers});
  }

  handleFinishAudio = async ()=>{
    if (this.props.callback) {
      this.props.callback();
    }
  }

  render() {
    let {videoPlayers, musicPlayers, audioPlayers} = this.state;
    return <div className="media">
      <div className="video">
        {videoPlayers}
      </div>
      <div className="audio">
        {musicPlayers}
        {audioPlayers}
      </div>
    </div>
  }
};

export default Video;