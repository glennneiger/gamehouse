import React, {Component} from 'react';
import {screens, assignAgents} from './helpers';

import Breakdown from './Breakdown';
import Final from './Final';
import Party from './Party';
import Map from './Map';
import Slides from './Slides';
import Owner from './Owner';
import Rounds from './Rounds';

import {incrementGame, inputRequest} from '../../../../actions';
import {games} from '../../../../helpers/games';
import {testing} from '../../../../helpers/testing';
import { requests } from '../../../../actions/requestTypes';


export default class Speakeasy extends Component {

  constructor(props) {
    super(props);
    this.state={
      players: [],
      turn: -1, // -1=rules. 0=set up (who's who). 1=first turn
      screen: screens.intro,
      successes: [],
      numRaids: 0,
      owner: null, //index
      owners: [], //keep track of everyone who has been an owner. This way we won't make the same person owner twice in a row
      agents: [], //indices,
      availableLocations: [], // location indices. set in init()
      location: null, // index current location of speakeasy
      playersWhoHaveFoundSpeakeasy: [],
      guestList: [],
      numSnitches: 0 // if an agent decides to have the speakeasy raided, the number increments. Resets each round. 
    }
  }

  componentDidMount() {
    this.init();
  }
  
  init = ()=> { 
    this.props.playAudio('music', 'speakeasy/0');
    this.props.playVideo('intro');

    let {turn} = this.state;
    let next;

    if (turn===-1) { //turn is -1 if you just loaded game from lobby. 

      const next2 = ()=> {this.switchScreen(screens.breakdown)};

      next = ()=> {
        this.playVoice('intro/1', next2);
        // give host option to skip 
        const {code, hostIndex} = this.props.room;
        inputRequest(code, requests.skip, null, hostIndex, this.handleSkip);
      };

      this.playVoice('intro/0', next);

    } else { // turn is > -1 if you're restarting the game to play again.
      turn=0; // in which case, no need to explain the rules again. Skip to turn 0 (first turn)
      next = ()=> {
        this.props.playVideo('back');;
        this.switchScreen(screens.owner);
      };
      this.playVoice('restart/0', next);
    }

    this.props.preloadMusic('speakeasy/happy0');

    //take up to 12 players
    const players = this.props.room.players.slice(0, 12);

    this.setState({
      turn, 
      screen: screens.intro,
      successes: [],
      numRaids: 0,
      availableLocations: [0,1,2,3,4,5,6,7,8], 
      playersWhoHaveFoundSpeakeasy: [],
      players
    });

    incrementGame(games.speakEasy);
  }

  handleSkip = ()=> {
    if (this.state.screen === screens.intro) {
      this.props.playVideo('back');
    }
    this.setState({turn: 0});
    this.switchScreen(screens.owner);
  }

  assignOwner = ()=> {
    const {players} = this.state;
    let owners = this.state.owners.slice();
    if (owners.length >= players.length) {
      owners = [];
    }
    let owner = null;
    while (!owner) {
      let index = players[Math.floor(Math.random()*players.length)].index;
      if (!owners.includes(index)) owner = index;
    }
    owners.push(owner);
    this.setState({owner, owners});
    return owner;
  }

  assignRoles = callback=> {
    const {code} = this.props.room;
    const players = this.state.players.slice();
    const {owner} = this.state;
    let playersWhoHaveAcknowledged = [];

    const acknowledgeRole = (input, index)=> {
      playersWhoHaveAcknowledged.push(index);
      if (playersWhoHaveAcknowledged.length===players.length-1) {
        callback();
      }
    }
    const agents = assignAgents(players, owner);
    this.setState({agents});
    players.forEach(player => {
      let role = 'Patron';
      if (agents.includes(player.index)) role='Agent';
      if (owner!==player.index) inputRequest(code, requests.speakeasy.acknowledgeRole, role, [player.index], acknowledgeRole);
    });
  }

  requestNewLocation = callback=> {
    const setNewLocation = input => {
      const location = input.message;
      this.setState({location});
      callback();
    }
    const {code} = this.props.room;
    const {owner, availableLocations} = this.state;
    inputRequest(code, requests.speakeasy.newLocation, {availableLocations}, owner, setNewLocation);
  }

  getInvitation = callback=> {
    const setInvitedPlayer = input => {
      const invited = input.message; // player index
      let playersWhoHaveFoundSpeakeasy = this.state.playersWhoHaveFoundSpeakeasy.slice();
      let guestList = this.state.guestList.slice();
      playersWhoHaveFoundSpeakeasy.push(invited);
      guestList.push(invited);
      this.setState({playersWhoHaveFoundSpeakeasy, guestList});
      callback();
    }

    const {code} = this.props.room;
    const {players} = this.state;
    const {owner, playersWhoHaveFoundSpeakeasy} = this.state;
    let playersWhoCanBeInvited = [];
    players.forEach(player=> {
      if (player.index !== owner && !playersWhoHaveFoundSpeakeasy.includes(player.index)) {
        // only players who have not already found the speakeasy can be invited
        playersWhoCanBeInvited.push({index: player.index, name: player.name}); 
      }
    })
    inputRequest(code, requests.speakeasy.invitation, playersWhoCanBeInvited, owner, setInvitedPlayer);

  }

  getWhoGoesWhere = callback=> {
    let playersWhoHaveResponded = [];

    const players = this.state.players.slice();

    const handleResponse = (input, index)=> {

      /*
      input = {
        found: boolean  // did they find it? null if they already found it 
        raid: boolean  // do they choose to raid it? null if they're not an agent
      }
      */
      
      const {found, raid} = input.message;

      if (found===true) {
        let playersWhoHaveFoundSpeakeasy = this.state.playersWhoHaveFoundSpeakeasy.slice();
        if (!playersWhoHaveFoundSpeakeasy.includes(index)) playersWhoHaveFoundSpeakeasy.push(index);
        if (raid) {
          let {numSnitches} = this.state;
          numSnitches++;
          this.setState({numSnitches});
        }
        this.setState({playersWhoHaveFoundSpeakeasy});
      }

      playersWhoHaveResponded.push(index);
      if (playersWhoHaveResponded.length===players.length-1) {
        //wait for all player (minus owner) to respond 
        callback();
      }
    }

    const {playersWhoHaveFoundSpeakeasy, owner} = this.state;
    // the last player on the list of those who have found it is the one who just got invited, as set in getInvitation()
    const playerWhoGotInvitation = playersWhoHaveFoundSpeakeasy[playersWhoHaveFoundSpeakeasy.length-1];

    players.forEach(player=> {
      if (player.index===owner) return; //we don't need any input from the owner at this point
      const {availableLocations, agents, location} = this.state;
      const {code} = this.props.room;
      const invited = player.index===playerWhoGotInvitation;
      const alreadyFound = playersWhoHaveFoundSpeakeasy.includes(player.index);
      const isAgent = agents.includes(player.index);
      const message = {invited, alreadyFound, isAgent, availableLocations, correctLocation: location}; // this is the info we send to the player's device
      inputRequest(code, requests.speakeasy.whereToGo, message, player.index, handleResponse);
    });
  }


  getRaid = ()=> {
    const {numSnitches} = this.state;
    const wasRaided = numSnitches > 0;
    if (wasRaided) {
      const {location} = this.state;
      let {numRaids} = this.state;
      let availableLocations = this.state.availableLocations.slice();
      numRaids++;
      availableLocations.splice(availableLocations.indexOf(location), 1); // can't go back here
      this.setState({numRaids, availableLocations, guestList: [], playersWhoHaveFoundSpeakeasy: []});
    }
    let successes = this.state.successes.slice();
    successes.push(!wasRaided);
    this.setState({successes});
    return wasRaided;
  }
  


  nextTurn = ()=> {
    let {turn} = this.state;
    turn++;
    this.setState({turn, numSnitches: 0});
  }

  switchScreen = screen=> {
    if (screen===screens.intro) {
      this.init();
      return;
    }
    this.setState({screen});
  }
  playVoice = (filename, onFinish)=> {
    this.props.playAudio('audio',`speakeasy/${filename}`, onFinish);
  }

  animateOut = (elementId, nextScreen)=> {
    let el = document.getElementById(elementId);
    if (el) el.classList.add('slide-up');
    setTimeout(() => {
      this.switchScreen(nextScreen);
    }, 1000);
  }


  render() {
    const {turn, successes, screen, owner, agents, numRaids, playersWhoHaveFoundSpeakeasy, guestList, numSnitches, players} = this.state;
    const {playAudio, playVideo, preloadMusic, room} = this.props;
    const {switchScreen, playVoice, assignOwner, nextTurn, requestNewLocation, animateOut, assignRoles, getWhoGoesWhere, getInvitation, getRaid} = this;

    if (!room.players.length) room.players=testing.players;

    const props = {
      room,
      switchScreen,
      turn,
      playVideo,
      playVoice,
      playAudio,
      preloadMusic,
      successes,
      numRaids,
      owner,
      animateOut,
      playersWhoHaveFoundSpeakeasy,
      players
    }

    switch (screen) {
      case screens.breakdown:
        return (
          <Breakdown
            {...props}
            nextTurn = {nextTurn}
            assignRoles={assignRoles}
          />
        )
      case screens.final:
        return (
          <Final 
            {...props}
            agents={agents}
          />
        )
      case screens.party:
        return (
          <Party 
            {...props}
            numSnitches={numSnitches}
            getRaid={getRaid}
            guestList={guestList}
          />
        )
      case screens.slides:
        return (
          <Slides 
            {...props}
            nextTurn = {nextTurn}
          />
        )
      case screens.map:
        return (
          <Map 
            {...props}
            requestNewLocation={requestNewLocation}
            getInvitation={getInvitation}
            getWhoGoesWhere={getWhoGoesWhere}
          />
        )
      case screens.owner:
        return (
          <Owner 
            {...props}
            assignOwner={assignOwner}
          />
        )
        case screens.rounds:
          return (
            <Rounds 
              {...props}
              nextTurn = {nextTurn}
            />
          )
        default:
          return null;
    }
  }
}