import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';
import PlayAgain from './device/PlayAgain';
import StoryTimeWriteLine from './device/StoryTimeWriteLine';
import StoryTimeVote from './device/StoryTimeVote';
import MenuLink from './device/MenuLink';

import Ad from './device/Ad';

import Logo from './device/Logo';

import {watchForChange, getValue, roomExists, selectGame, removeWatcher, leaveRoom, deleteRoom} from '../actions';
import {games} from '../actions/games';
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
      screen: games.newRoom, 
      requestMessage: '', //any special message that comes in with an input request,
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

    const playerIndex = localStorage.getItem('playerIndex');
    const hostName = localStorage.getItem('hostName');
    const host = localStorage.getItem('host');

    this.setRoom(code, playerIndex, host, hostName);

    let data = await getValue(code, `players/${playerIndex}/request`);
    const request = await data.toJSON();
    if (request) {
      this.setState({screen: request.requestType, requestMessage: request.requestMessage});
    } else {
      data = await getValue(code, 'game');
      const game = await data.toJSON();
      this.setState({screen: game});
    }
  }

  updateGame = async data=> {
    const game = await data.toJSON();
    if (!game) return;
    this.setState({screen: game});

    if (game===games.landing) {
      this.handleLeaveRoom();
    }
  }

  updateRequest = async data=> {
    const request = await data.toJSON();
    if (!request) {
      return;
    }
    if (request==='submitted') {
      this.setState({screen: null, requestMessage: null});
    } else {
      this.setState({screen: request.requestType, requestMessage: request.requestMessage});
    }
  }

  setRoom = (code, playerIndex, host, hostName)=> {
    this.setState({code, playerIndex, entered: true, hostName, host});
    watchForChange(code, 'game', this.updateGame);
    watchForChange(code, `players/${playerIndex}/request`, this.updateRequest);

    // save roomCode and playerIndex in localStorage 
    // in case a player refreshes browser, it can automatically go back into room
    localStorage.setItem('roomCode', code);
    localStorage.setItem('playerIndex', playerIndex);
    localStorage.setItem('host', host);
    localStorage.setItem('hostName', hostName);
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
      removeWatcher(code, `players/${playerIndex}/request`);
    }

    this.setState({
      host: false,
      hostName: '',
      entered: false,
      code: '', 
      playerIndex: 0,
      screen: 'thank-you', 
      requestMessage: '',
      showMenu: false
    });
  }

  handleExitGame = ()=> {
    selectGame(this.state.code, games.gameRoom);
    this.setState({showMenu: false});
  }

  handleCloseParty = ()=> {
    let {code} = this.state;
    selectGame(code, games.landing);
    this.handleLeaveRoom();
    deleteRoom(code);
  }

  render() {
    return (
      <div>
        <Logo />
        {this.renderContent()}
      </div>
    )
  }

  renderContent = ()=> {
    const {host, code, entered, hostName, requestMessage, playerIndex, screen, showMenu} = this.state;

    let menu = {
      // option to leave party
      leave: <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('leave', showMenu)} handleAction={this.handleLeaveRoom} clicked={showMenu==='leave'} text='leave the party' caption='Leave Party' />,
      // exit to lobby from game
      exit: null, // these menu options are only given to host
      // close the whole party down
      close: null // ...
    }
    if (host) {
      menu.exit = <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('exit', showMenu)} handleAction={this.handleExitGame} clicked={showMenu==='exit'} text='exit the game and return to the lobby' caption='Return to Lobby' />
      menu.close = <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('close', showMenu)} handleAction={this.handleCloseParty} clicked={showMenu==='close'} text='close the party' caption='Close Party' />
    }

    if (showMenu) return <div>{menu[showMenu]}</div>;

    console.log(screen);
    switch (screen) {
      case games.gameRoom:
        return (
          <div>
            <SelectGame host={host} code={code} />
            {menu.leave}
            {menu.close}
          </div>
        )
      case games.newRoom:
        return (
          <div>
            <JoinRoom setRoom = {this.setRoom} code={code} entered={entered} hostName={hostName} host={host} />
            {menu.leave}
            {menu.close}
          </div>
        )
      case requests.storyTime.writeLine:
        return (
          <div>
            <StoryTimeWriteLine prompt={requestMessage} code={code} playerIndex={playerIndex} handleSubmit={()=>this.setState({screen: games.storyTime})}/>
            {menu.exit}
          </div>
        )
      case requests.storyTime.vote:
        return (
          <div>
            <StoryTimeVote options={requestMessage} code={code} playerIndex={playerIndex} handleSubmit={()=>this.setState({screen: games.storyTime})}/>
            {menu.exit}
          </div>

        )
      case requests.playAgain:
        return (
          <PlayAgain code={code} playerIndex={playerIndex} />
        )
      case 'thank-you':
        return (
          <div className="column">
            <p>Thank you for playing!</p>
            <Ad />
            <div className="btn" onClick={()=>this.setState({screen: games.newRoom})}>Join New Game</div>
          </div>
        )
      default: // default screen shown during games
        return (
          <div>
            <Ad />
            {menu.exit}
          </div>
        )
    }
  }
}


export default Device;

