import React, {Component} from 'react';

class Video extends Component {

  constructor(props) {
    super(props);

    this.state = {currentPlayer: 1};
  }

  componentDidMount() {
    document.getElementById('video-player-2').style.display='none';
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props

    //new video
    if(oldProps.video !== newProps.video) {
      let {currentPlayer} = this.state;
      let {video} = newProps;
      let {preload} = oldProps;

      //stop the current video 
      let player = document.querySelector(`#video-player-${currentPlayer}`);
      player.pause();

      // see if the new music has already been preloaded. This can be done to cut down on load time
      if (video===preload) {
        // if so, switch to the player that has it preloaded (there are 2)
        player.style.display = "none";
        currentPlayer===1 ? currentPlayer = 2 : currentPlayer = 1;
        player = document.querySelector(`#video-player-${currentPlayer}`);
        player.style.display = "block";
        this.setState({currentPlayer});
      } else {
        // if not, load it
        document.querySelector(`#video-src-${currentPlayer}`).src=(`assets/video/${video}.mp4`);
        player.load();
      }
      player.play();
    }

    // new preload 
    if(oldProps.preload !== newProps.preload) {
      setTimeout(() => {  
        let {preload} = newProps;
        let {currentPlayer} = this.state;
        let backupPlayer = 1;
        if (currentPlayer===1) {
          backupPlayer = 2;
        } 
        let player = document.querySelector(`#video-player-${backupPlayer}`);
        document.querySelector(`#video-src-${backupPlayer}`).src=(`assets/video/${preload}.mp4`);
        player.load();
      }, 500);
    }
    
  }

  render () {
    return (
      <div>
        <video id="video-player-1" className="bg-video" loop muted>
          <source id="video-src-1" src='' type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <video id="video-player-2" className="bg-video" loop muted>
          <source id="video-src-2" src='' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }
};

export default Video;