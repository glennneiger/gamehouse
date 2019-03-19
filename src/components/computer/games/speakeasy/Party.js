import React, {Component} from 'react';

import PlayerGrid from '../../PlayerGrid';

import {screens} from './helpers';

export default class Party extends Component {

  constructor(props) {
    super(props);

    const guestList = props.guestList.slice();
    const playersWhoHaveFoundSpeakeasy = props.playersWhoHaveFoundSpeakeasy.slice();
    const numPreviousRaids = props.numRaids;
    const wasRaided = props.getRaid();

    this.state = {
      playersShown: [],
      guestList, playersWhoHaveFoundSpeakeasy, numPreviousRaids, wasRaided
    }
  }

  componentDidMount() {
    if (!(this.state.wasRaided===true || this.state.wasRaided===false)) return;

    const {turn, successes} = this.props;
    let voice = 0;

    // if there was a raid on the last turn, and therefore we're now open in a new location 
    if (turn > 1 && successes[turn-2]===false) {
      voice = `newlocation/${this.state.numPreviousRaids}`;
    } else {
      voice = turn;
    }

    this.props.playVideo('speakeasy/drinking');
    this.props.playAudio('music', `speakeasy/drinking${(turn-1) % 3}`);
    this.props.playVoice(`party/intro/${voice}`, this.showInvited);

    if (this.state.wasRaided) {
      this.props.preloadVideo(`speakeasy/raid${this.state.numPreviousRaids}`);
      if (this.state.numPreviousRaids===2) {
        this.props.preloadMusic('speakeasy/gameover');
      } else {
        this.props.preloadMusic(`speakeasy/bad${this.state.numPreviousRaids}`);
      }
    } else {
      const numSuccesses = turn - this.state.numPreviousRaids;
      this.props.preloadVideo('speakeasy/back');
      if (numSuccesses===3) {
        this.props.preloadMusic('speakeasy/gameover');
      } else {
        this.props.preloadMusic(`speakeasy/happy${numSuccesses}`);
      }
    }

  }

  showInvited = ()=> {
    document.getElementById('party-full-screen').classList.add('darken');
    const playersShown = this.getPlayersFromIndices(this.state.guestList);
    this.setState({playersShown});
    const numWhoSnuckIn = this.state.playersWhoHaveFoundSpeakeasy.length - this.state.guestList.length;
    setTimeout(() => {
      this.props.playVoice(`party/whoelse/${numWhoSnuckIn > 4 ? 4 : numWhoSnuckIn}`, this.showWhoSnuckIn);
    }, 1000);
  }

  showWhoSnuckIn = ()=> {
    const {playersWhoHaveFoundSpeakeasy, guestList} = this.state;
    console.log(this)
    if (playersWhoHaveFoundSpeakeasy.length > guestList.length) {
      const playersToAdd = playersWhoHaveFoundSpeakeasy.filter(player=>{
        return !guestList.includes(player);
      });
      const playersShown = this.state.playersShown.concat(this.getPlayersFromIndices(playersToAdd));
      this.setState({playersShown});
    }

    this.setState({playersShown: this.state.playersWhoHaveFoundSpeakeasy});
    setTimeout(() => {
      let voice = 4;
      if (this.state.playersWhoHaveFoundSpeakeasy.length < 4) voice = this.state.playersWhoHaveFoundSpeakeasy.length;
      this.props.playVoice(`party/commentary/${voice}`, this.showIfRaid);
    }, 1000);
  }

  showIfRaid = ()=> {
    let voice;
    if (this.state.wasRaided) {
      this.props.playVideo(`speakeasy/raid${this.state.numPreviousRaids}`);
      this.props.preloadVideo('speakeasy/back');
      if (this.state.playersWhoHaveFoundSpeakeasy.length===1) {
        voice = 'raid/onlyone/0';
      } else if (this.state.numPreviousRaids===2) {
        voice = 'raid/final/0';
      } else {
        voice = `raid/${this.props.numSnitches}`;
      }
    } else {
      voice = `noraid/${this.props.turn}`;
    }
    this.props.playVoice(`party/${voice}`, this.goToNextScreen);
  }

  goToNextScreen = ()=> {
    document.getElementById('party-full-screen').classList.remove('darken');
    document.getElementById('party-grid-container').classList.add('slide-up');
    setTimeout(()=>{
      this.props.switchScreen(screens.rounds);
    }, 3500);
  }

  getPlayersFromIndices = arr=> {
    const players = this.props.room.players.slice();
    return arr.map(el=>{
      return players[el];
    });
  }

  render() {
    const playersShown = this.state.playersShown;
    return (
      <div className="Speakeasy Party" id="party-full-screen">
        <div id="party-grid-container">
          <PlayerGrid max={12} rows={2} players={playersShown} />
        </div>
      </div>
    )
  }
}