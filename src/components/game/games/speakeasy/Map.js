import React, {Component} from 'react';
import {screens} from './helpers';

export default class Map extends Component {


  componentDidMount() {
    const {turn, requestNewLocation} = this.props;

    if (turn===0) {

      requestNewLocation(()=>{this.props.animateOut('map', screens.breakdown)});

    } else if (this.justRaided()) {

      // get new location, then send invitation
      const {numRaids} = this.props;
      const onFinishVoice = ()=>{requestNewLocation(this.decideWhoGetsInvitation)};
      this.props.playVoice(`newlocation/${numRaids}`, onFinishVoice);

    } else {

      //just send the invitation 
      this.decideWhoGetsInvitation();

    }
  }

  justRaided = ()=> {
    const {turn, successes} = this.props;
    if (turn===1) return false;
    return !successes[turn-2]; 
    // e.g. if this is turn 3 (third turn) we look at second entry (index 1) to see if last turn was a raid.
  }

  decideWhoGetsInvitation = ()=> {

    const {playersWhoHaveFoundSpeakeasy, players} = this.props;
    if (playersWhoHaveFoundSpeakeasy.length === players.length-1) {
      // all players (minus owner) have already found the speakeasy. No need for invites!
      this.props.playVoice('sendinvitation/alreadyfull/0', this.goToParty);
      return;
    }

    let voice;
    if (this.justRaided()) {
      const {numRaids} = this.props;
      voice = `afterraid/${numRaids}`
    } else {
      const {turn} = this.props;
      voice = turn;
    }

    const onFinishVoice = ()=> {this.props.getInvitation(this.decideWhereToGo)};
    this.props.playVoice(`sendinvitation/${voice}`, onFinishVoice);
  }

  decideWhereToGo = ()=> {
    const {turn} = this.props;
    const onFinishVoice = ()=> {this.props.getWhoGoesWhere(this.goToParty)};
    this.props.playVoice(`wheretogo/${turn}`, onFinishVoice);
  }

  goToParty = ()=> {
    this.props.animateOut('map', screens.party);
  }

  render() {
    return (
      <div className="Speakeasy Map center-screen">
        <img src="assets/img/speakeasy/map.svg" alt="map" className="slide-in-from-bottom" id="map" />
      </div>
    )
  }
}