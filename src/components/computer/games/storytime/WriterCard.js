import React, {Component} from 'react';
import ProfileCard from '../../ProfileCard';

class WriterCard extends Component {

  renderVoters = ()=> {
    if (!this.props.votes) {
      return;
    }
    //images of players who votes for this writer's answer will be shown at bottom of image
    return this.props.votes.map((voter, i) => (
      <img className="voter-icon" id={`voter-icon-${i}`} key={i} src={`./assets/img/profiles/${('0' + this.props.players[voter].img).slice(-2)}.jpg`} alt={this.props.players[voter].name} />
    ));
  }

  render() {
    return (
      <div className="WriterCard column">
        <div className={`speech-bubble ${this.props.submitted ? 'submitted' : ''}`}>{this.props.text}</div>
        <ProfileCard name={this.props.name} img={this.props.img} hideName={true} />
        {this.renderVoters()}
      </div>
    )
  }
}

export default WriterCard;