import React, {Component} from 'react';
import Video from '../../VideoBackground';
import ProfileCard from '../../ProfileCard';
import {screens} from './helpers';

class Next extends Component {

  componentDidMount() {
    setTimeout(()=>{ 
      this.props.switchScreen(screens.write);
    }, 4000);
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
        <Video video="storytime/whosnext" />
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