import React, {Component} from 'react';

class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {currentPlayer: 1,
      playerSources: {
        1: null,
        2: null
      }, preloaded: false};
  }

  componentDidMount() {
    document.getElementById('video-player-2').style.display='none';
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props

    //new video
    if(oldProps.video !== newProps.video) {
      let {currentPlayer, playerSources} = this.state;
      let {video} = newProps;
      let {preload} = oldProps;

      //stop the current video 
      let player = document.querySelector(`#video-player-${currentPlayer}`);
      if (!player) return;
      player.pause();

      // see if the new music has already been preloaded. This can be done to cut down on load time
      if (video===preload && this.state.preloaded && playerSources[currentPlayer]===video) {
        // if so, switch to the player that has it preloaded (there are 2)
        player.style.display = "none";
        currentPlayer===1 ? currentPlayer = 2 : currentPlayer = 1;
        player = document.querySelector(`#video-player-${currentPlayer}`);
        if (!player) return;
        player.style.display = "block";
        this.setState({currentPlayer});
      } else {
        // if not, load it
        document.querySelector(`#video-src-${currentPlayer}`).src=(`assets/video/${video}.mp4`);
        player.load();
        playerSources[currentPlayer] = video;
        this.setState({playerSources});
      }
      player.play();
    }

    // new preload 
    if(oldProps.preload !== newProps.preload) {
      this.setState({preloaded: false});
      setTimeout(() => {  
        let {preload} = newProps;
        let {currentPlayer, playerSources} = this.state;
        let backupPlayer = 1;
        if (currentPlayer===1) {
          backupPlayer = 2;
        } 
        let player = document.querySelector(`#video-player-${backupPlayer}`);
        if (!player) return;
        document.querySelector(`#video-src-${backupPlayer}`).src=(`assets/video/${preload}.mp4`);
        player.load();
        playerSources[currentPlayer] = preload;
        this.setState({playerSources});
      }, 200);
    }
    
  }

  onLoaded = async e=>{
    if (e.target.dataset.id !== this.state.currentPlayer) {
      this.setState({preloaded:true});
    }
    if (this.props.handleOnPlay) {
      this.props.handleOnPlay();
    }
  }

  render () {
    return (
      <div>
        <video id="video-player-1" data-id={1} className="bg-video" loop muted onLoadedData={this.onLoaded}>
          <source id="video-src-1" src='' type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <video id="video-player-2" data-id={2} className="bg-video" loop muted onLoadedData={this.onLoaded}>
          <source id="video-src-2" src='' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }
};

export default Video;