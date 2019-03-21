import React, {Component} from 'react';

class Card extends Component {
  
  render() {
    return (
      <div className="ProfileCard">
        <img src={`./assets/img/profiles/${('0' + this.props.img).slice(-2)}.jpg`} alt={this.props.name} />
        <div className="name">{this.props.hideName ? '' : this.props.name}</div>
      </div>
    )
  }

}

export default Card;