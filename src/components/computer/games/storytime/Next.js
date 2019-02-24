import React, {Component} from 'react';
import Video from '../../VideoBackground';
import ProfileCard from '../../ProfileCard';
import {screens} from './helpers';

class Next extends Component {

  renderProfileCards = ()=> {

    let cards = this.props.writers.map(writer=> (
      <ProfileCard name={writer.name} img={writer.img}/>
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
        {this.renderProfileCards()}
      </div>
    )
  }
}

export default Next;