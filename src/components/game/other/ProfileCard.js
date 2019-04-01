import React, {Component} from 'react';

class Card extends Component {


  render() {  
    const {img} = this.props;
    let src;
    // img is either an index (representing an animal pic) or a constum img url
    if (Number.isInteger(img)) {
      src=`./assets/img/profiles/${('0' + this.props.img).slice(-2)}.jpg`;
    } else {
      src = img;
    }
    return (
      <div className="ProfileCard">
        <img src={src} alt={this.props.name} />
        <div className="name">{this.props.hideName ? '' : this.props.name}</div>
      </div>
    )
  }

}

export default Card;