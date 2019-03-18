import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';
import PlayAgain from './device/PlayAgain';
import StoryTime from './device/games/storytime/Index';
import Speakeasy from './device/games/speakeasy/Index';
import MenuLink from './device/MenuLink';

import Ad from './device/Ad';

import Logo from './device/Logo';

import {watchForChange, getValue, roomExists, selectGame, removeWatcher, leaveRoom, deleteRoom} from '../actions';
import {games} from '../helpers/games';
import {requests} from '../actions/requestTypes';

class Device extends Component {

  constructor(props) {
    super(props);

    this.state = {
      host: false,  // are you the host 
      hostName: '',
      entered: false, // have you entered room 
      code: '',  //room code
      playerIndex: 0,
      request: null,
      game: games.newRoom,
      showMenu: false
    }

  }

  componentDidMount() {
    //this class will turn body bg color white instead of black
    document.querySelector('body').classList.add('device');

    // see if player is already in room (if they refreshed browser)
    const roomCode = localStorage.getItem('roomCode');
    if (roomCode) {
      this.refreshGame(roomCode);
    }
  }


  // called if a player refreshes browser
  refreshGame = async (code)=> {

    const exists = await roomExists(code);
    if (!exists) { // room no longer exists
      localStorage.clear();
      return;
    }

    const playerIndex = parseInt(localStorage.getItem('playerIndex'));

    this.setRoom(code, playerIndex);

    const request = await getValue(code, `players/${playerIndex}/request`);
    if (request) this.setState({request});
    const game = await getValue(code, 'game');
    this.setState({game});
  }

  updateGame = game=> {
    if (!game || game===games.landing) {
      this.handleLeaveRoom();
    } else {
      this.setState({game});
    }
  }

  updateHost = host=> {
    const isHost = host.index===this.state.playerIndex;
    this.setState({host: isHost, hostName: host.name});
  }

  updateRequest = request=> {
    if (request==='submitted' || (request==='expired')) {
      this.setState({request: null});
    } else {
      this.setState({request});
    }
  }

  setRoom = async (code, playerIndex)=> {
    let host = await getValue(code, `host`);
    if (!host) host=0;
    let isHost = host.index === playerIndex;
    this.setState({code, playerIndex, entered: true, host: isHost, hostName: host.name});
    watchForChange(code, 'game', this.updateGame, true);
    watchForChange(code, 'host', this.updateHost);
    watchForChange(code, `players/${playerIndex}/request`, this.updateRequest);

    // save roomCode and playerIndex in localStorage 
    // in case a player refreshes browser, it can automatically go back into room
    localStorage.setItem('roomCode', code);
    localStorage.setItem('playerIndex', playerIndex);
  }

  handleClickMenu = (menu, showMenu)=> {
    if (showMenu) { //boolean
      this.setState({showMenu: menu}); //string
    } else {
      this.setState({showMenu: false})
    }
  }

  handleLeaveRoom = ()=> {
    localStorage.clear();
    const {code, playerIndex} = this.state;

    if (code) {
      leaveRoom(code, playerIndex);
      removeWatcher(code, 'game');
      removeWatcher(code, 'host');
      removeWatcher(code, `players/${playerIndex}/request`);
    }

    this.setState({
      host: false,
      hostName: '',
      entered: false,
      code: '', 
      playerIndex: 0,
      request: null,
      game: 'thank-you',
      showMenu: false
    });
  }

  handleExitGame = ()=> {
    selectGame(this.state.code, games.gameRoom);
    this.setState({showMenu: false});
  }

  handleCloseParty = ()=> {
    const {code} = this.state;
    selectGame(code, games.landing);
    this.handleLeaveRoom();
    deleteRoom(code);
  }




  render() {

    const {host, entered, game, showMenu} = this.state;

    let menu = null;

    if (entered) {
      if (game===games.gameRoom || game===games.newRoom) {
        menu = [];
        menu.push(
          <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('leave', showMenu)} handleAction={this.handleLeaveRoom} clicked={showMenu==='leave'} text='Are you sure you want to leave the party?' caption='Leave Party' key={0} />
        )
        if (host) {
          menu.push(
            <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('close', showMenu)} handleAction={this.handleCloseParty} clicked={showMenu==='close'} text='Are you sure? This will close the party for all players.' caption='Close Party' key={1} />
          )
        }
      } else if (host) {
        menu=<MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('exit', showMenu)} handleAction={this.handleExitGame} clicked={showMenu==='exit'} text='Exit the current game and return to the lobby?' caption='Return to Lobby' />
      }
    }
    return (
      <div>
        <Logo />
        {this.renderContent()}
        {menu}
      </div>
    )
  }




  renderContent = ()=> {
    const {host, code, entered, hostName, request, playerIndex, game} = this.state;

    const gameProps = {request, code, playerIndex, handleSubmit: ()=>this.setState({request: null})}

    switch (game) {
      case games.gameRoom:
        return <SelectGame host={host} hostName={hostName} code={code} playerIndex={playerIndex} />

      case games.newRoom:
        return <JoinRoom setRoom = {this.setRoom} code={code} entered={entered} hostName={hostName} host={host} />

      case games.storyTime:
        return <StoryTime {...gameProps} />

      case games.speakEasy:
        return <Speakeasy {...gameProps} />

      case requests.playAgain:
        return <PlayAgain code={code} playerIndex={playerIndex} />


      case 'thank-you':
        return (
          <div className="column">
            <p>Thank you for playing!</p>
            <Ad />
            <div className="btn" onClick={()=>this.setState({game: games.newRoom})}>Join New Game</div>
          </div>
        )
      default: 
        return <Ad />
    }
  }
}


export default Device;

