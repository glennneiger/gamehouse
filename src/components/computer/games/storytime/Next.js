import React, {Component} from 'react';
import ProfileCard from '../../ProfileCard';
import {screens} from './helpers';

class Next extends Component {


  componentDidMount() {
    let {turn} = this.props;

    this.props.playVideo('storytime/next');
    this.props.preloadVideo(`storytime/write0${turn}`);

    this.props.playVoice(`next/${turn}`, this.nextScreen);
  }

  nextScreen = ()=> {
    this.props.switchScreen(screens.write);
  }


  renderProfileCards = ()=> {

    let cards = this.props.writers.map((writer, i)=> (
      <ProfileCard name={writer.name} img={writer.img} key={i}/>
    ))
    return (
      <div className="row">
          {cards}
      </div>
    )
  }

  render() {
    return (
      <div className="StoryTime">
        <div className="row">
          <div className="story-text prompt">
            {this.props.prompt}, _________ .
          </div>
        </div>
        {this.renderProfileCards()}
      </div>
    )
  }
}

export default Next;