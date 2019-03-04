import React, {Component} from 'react';

class Final extends Component {

  componentDidMount() {
    this.props.playVideo('storytime/final');
    this.props.playAudio('music', 'storytime/final');
    this.props.preloadVideo('storytime/intro');
    this.props.preloadMusic('storytime/main');
  }

  render() {
    return (
      <div className="StoryTime">
        <div className="center-screen">
          <div className="story-text">
            {this.props.story}
          </div>
        </div>
      </div>
    )
  }
}

export default Final;