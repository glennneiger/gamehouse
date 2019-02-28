import React, {Component} from 'react';
import ProfileCard from '../../ProfileCard';
import {screens} from './helpers';

class Next extends Component {

  constructor(props) {
    super(props);
    this.state = {timerSet: false};
  }

  componentDidMount() {
    this.props.playVideo('storytime/whosnext');
    if (!this.state.timerSet) {
      setTimeout(()=>{ 
        this.props.switchScreen(screens.write);
      }, 500);
      this.setState({timerSet:true});
    }
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