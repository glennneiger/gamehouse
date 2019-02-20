import React, {Component} from 'react';

class Card extends Component {
  
  render() {
    return (
      <div className="ProfileCard">
        <img src={`assets/img/profiles/${this.props.img}.jpg`} alt={this.props.name} />
        <div className="name">{this.props.name}</div>
      </div>
    )
  }

}

export default Card;