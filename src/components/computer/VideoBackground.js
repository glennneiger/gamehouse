import React, {Component} from 'react';

class Video extends Component {

  componentDidUpdate(oldProps) {
    const newProps = this.props
    if(oldProps.video !== newProps.video) {
      let player = document.querySelector('.bg-video');
      let source = document.querySelector('.bg-video-src');
      player.pause();
      source.src=(`assets/video/${newProps.video}.mp4`);
      player.load();
      player.play();
    }
  }

  render () {
    return (

        <video className="bg-video" loop autoPlay muted>
          <source className="bg-video-src" src={`assets/video/${this.props.video}.mp4`} type="video/mp4" />
          <source className="bg-video-src" src={`assets/video/${this.props.video}.mp4`} type="video/ogg" />
          Your browser does not support the video tag.
        </video>

    )
  }
};

export default Video;