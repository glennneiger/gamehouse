import React, {Component} from 'react';

import ProfileCard from '../../ProfileCard';

import {screens} from './helpers';

export default class Owner extends Component {

  componentDidMount() {
    this.props.assignOwner();
    this.props.playVoice('owner/0', ()=>{this.props.animateOut('owner-card', screens.map)});
  }


  renderOwnerCard = ()=> {
    const {owner, room} = this.props;
    if (owner) {
      const {img, name} = room.players[owner];
      return <div className="slide-in-from-right" id="owner-card">
        <ProfileCard img={img} name={name} />
      </div>
    }
  }

  render() {
    return (
      <div className="Speakeasy Owner">
        {this.renderOwnerCard()}
      </div>
    )
  }
}