import React, {Component} from 'react';

import ProfileCard from '../../ProfileCard';

import {screens} from './helpers';

export default class Owner extends Component {

  componentDidMount() {
    this.props.assignOwner();
    this.props.playAudio('music', 'speakeasy/happy0');
    this.props.playVoice('newlocation/0', ()=>{this.props.animateOut('owner-card', screens.map)});
    this.props.preloadMusic('speakeasy/drinking0');
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