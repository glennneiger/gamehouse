import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';
import SelectGame from './device/SelectGame';
import PlayAgain from './device/PlayAgain';
import StoryTimeWriteLine from './device/StoryTimeWriteLine';
import StoryTimeVote from './device/StoryTimeVote';
import MenuLink from './device/MenuLink';

import Ad from './device/Ad';

import Logo from './device/Logo';

import {watchForChange, getValue, roomExists, selectGame, removeWatcher} from '../actions';
import {games} from '../actions/games';
import {requests} from '../actions/requestTypes';

class Device extends Component {

  constructor(props) {
    super(props);

    this.state = {
      vip: false,  // are you the VIP 
      vipName: '',
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
    const vipName = localStorage.getItem('vipName');

    this.setRoom(code, playerIndex, vipName);

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
    this.setState({screen: request.requestType, requestMessage: request.requestMessage});
  }

  setRoom = (code, playerIndex, vipName)=> {
    const vip = playerIndex===0; 
    this.setState({code, playerIndex, entered: true, vipName, vip});
    watchForChange(code, 'game', this.updateGame);
    watchForChange(code, `players/${playerIndex}/request`, this.updateRequest);

    // save roomCode and playerIndex in localStorage 
    // in case a player refreshes browser, it can automatically go back into room
    localStorage.setItem('roomCode', code);
    localStorage.setItem('playerIndex', playerIndex);
    localStorage.setItem('vipName', vipName);
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
    removeWatcher(code, 'game');
    removeWatcher(code, `players/${playerIndex}/request`);
    
    this.setState({
      vip: false,
      vipName: '',
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
    selectGame(this.state.code, games.landing);
    this.handleLeaveRoom()
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
    const {vip, code, entered, vipName, requestMessage, playerIndex, screen, showMenu} = this.state;

    let menu = {
      // option to leave party
      leave: <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('leave', showMenu)} handleAction={this.handleLeaveRoom} clicked={showMenu==='leave'} text='leave the party' caption='Leave Party' />,
      // exit to lobby from game
      exit: null, // these menu options are only given to vip
      // close the whole party down
      close: null // ...
    }
    if (vip) {
      menu.exit = <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('exit', showMenu)} handleAction={this.handleExitGame} clicked={showMenu==='exit'} text='exit the game and return to the lobby' caption='Return to Lobby' />
      menu.close = <MenuLink entered = {entered} handleClick={showMenu=>this.handleClickMenu('close', showMenu)} handleAction={this.handleCloseParty} clicked={showMenu==='close'} text='close the party' caption='Close Party' />
    }

    if (showMenu) return <div>{menu[showMenu]}</div>;

    switch (screen) {
      case games.gameRoom:
        return (
          <div>
            <SelectGame vip={vip} code={code} />
            {menu.leave}
            {menu.close}
          </div>
        )
      case games.newRoom:
        return (
          <div>
            <JoinRoom setRoom = {this.setRoom} code={code} entered={entered} vipName={vipName} />
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
          <PlayAgain code={code} />
        )
      case games.storyTime:
        return (
          <div>
            <Ad />
            {menu.exit}
          </div>
        )
      case 'thank-you':
        return (
          <div className="column">
            <p>Thank you for playing!</p>
            <Ad />
            <div className="btn" onClick={()=>this.setState({screen: games.newRoom})}>Join New Game</div>
          </div>
        )
      default:
        return (
          <Ad />
        )
    }
  }
}


export default Device;

