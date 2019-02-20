import React, {Component} from 'react';

class Video extends Component {
  constructor (props) {
    super(props);

    const videoURL = 'assets/video/' + this.props.videoURL;
    this.state = {
      videoURL
    }
  }

  render () {
    return (

        <video className="bg-video" loop autoPlay muted>
          <source src={this.state.videoURL} type="video/mp4" />
          <source src={this.state.videoURL} type="video/ogg" />
          Your browser does not support the video tag.
        </video>

    )
  }
};

export default Video;