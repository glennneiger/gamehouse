import React, {Component} from 'react';
import ProfileCard from '../../ProfileCard';
import {screens} from './helpers';

class Winner extends Component {

  constructor(props) {
    super(props);
    this.state = {timerSet: false};
  }

  componentDidMount() {
    this.props.playVideo('storytime/winner');
    if (!this.state.timerSet) {
      setTimeout(()=>{ 
        this.props.nextTurn();
        this.props.switchScreen(screens.read);
      }, 5000);
      this.setState({timerSet:true});
    }
  }


  render() {
    return (
      <div className="StoryTime">
        <div className="center-screen">
          <ProfileCard name={this.props.winner.name} img={this.props.winner.img} />
        </div>
      </div>
    )
  }
}

export default Winner;