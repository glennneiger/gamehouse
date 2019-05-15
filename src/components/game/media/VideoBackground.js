import React, {Component} from 'react';

class Video extends Component {

  /*
  Props:
    files: array
    folder: string
    curVideo: string
    handleFinishLoading: function
  */

  constructor(props) {
    super(props);
    this.state = {
      players: []
    }
  }


  componentDidUpdate(oldProps) {
    const {files, folder, curVideo} = this.props;
    if (folder !== oldProps.folder) {
      this.loadFiles(files);
    }
    if (curVideo && curVideo !== oldProps.curVideo) {
      if (oldProps.curVideo) {
        let oldPlayer = document.getElementById(`vid-${oldProps.curVideo}`);
        if (oldPlayer) oldPlayer.style.display = 'none';
      }
      let player = document.getElementById(`vid-${curVideo}`);
      if (player) {
        player.style.display = 'block';
        console.log('play: ' + curVideo);
        player.play();
      }
    }
  }

  loadFiles = async files => {
    console.log(files)
    let players = [];
    let needToLoad = files.length;

    const finishLoadingFile = ()=> {
      needToLoad--;
      if (!needToLoad) {
        this.props.handleFinishLoading();
      }
    }

    const {folder} = this.props;

    files.forEach(file => {
      players.push(
        <video key={file} id={`vid-${file}`} style={{'display':'none'}} className="bg-video" loop muted onLoadedData={finishLoadingFile}>
          <source src={`assets/video/${folder}/${file}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    });

    await this.setState({players});

    files.forEach(file => {
      let player = document.getElementById(`vid-${file}`);
      if (player) player.load();
      console.log('load: ' + file);
    });
  }

  render() {
    const {players} = this.state;
    return <div className="video">
      {players}
    </div>
  }
};

export default Video;