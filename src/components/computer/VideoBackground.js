import React, {Component} from 'react';

class Video extends Component {
  constructor (props) {
    super(props);

    const video = 'assets/video/' + this.props.video + '.mp4';
    this.state = {
      video
    }
  }

  render () {
    return (

        <video className="bg-video" loop autoPlay muted>
          <source src={this.state.video} type="video/mp4" />
          <source src={this.state.video} type="video/ogg" />
          Your browser does not support the video tag.
        </video>

    )
  }
};

export default Video;