import React, {Component} from 'react';
import PlayerGrid from '../../other/PlayerGrid';
import {screens} from './helpers';

class Next extends Component {


  componentDidMount() {
    let {turn} = this.props;

    this.props.playVideo('next');

    this.props.playVoice(`next/${turn}`, this.nextScreen);
  }

  nextScreen = ()=> {
    this.props.switchScreen(screens.write);
  }

  render() {
    return (
      <div className="StoryTime column">
        <div className="v-45 center">
          <div className="story-text prompt">
            {this.props.prompt}, _________ .
          </div>
        </div>
        <div className="v-55 grid">
          <PlayerGrid players={this.props.writers} max={4} rows={1} />
        </div>
      </div>
    )
  }
}

export default Next;