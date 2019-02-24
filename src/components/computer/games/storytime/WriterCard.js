import React, {Component} from 'react';
import ProfileCard from '../../ProfileCard';

class WriterCard extends Component {

  render() {
    return (
      <div className="WriterCard column">
        <div className="speech-bubble">{this.props.text}</div>
        <ProfileCard name={this.props.name} img={this.props.img} hideName={true} />
      </div>
    )
  }
}

export default WriterCard;