import React, {Component} from 'react';
import {joinRoom, selectGame, incrementSessions} from '../../actions';
import {games} from '../../actions/games';
import ImgSelection from './ImgSelection';

class JoinRoom extends Component {

  componentDidMount() {
    // test mode
    if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && !this.props.entered) {
      document.getElementById('room-code').value="TEST";
      const testNames = ['Jacob','Brandon','Karen','Stephen','Shayla','Jon','Debra','David','Emily','Luis','Tasheda','Ethan','Ariel'];
      document.getElementById('player-name').value = testNames[Math.floor(Math.random()*testNames.length)];
    }
  }

  startGame = () => {
    const {code} = this.props;
    selectGame(code, games.gameRoom);
    incrementSessions();
  }
  

  joinRoom = async () => {

    let roomCode = document.getElementById('room-code').value.toUpperCase();
    //ROOM CODE validation
    if (!roomCode.trim()) {
      alert('Enter Room Code');
      return;
    }

    let playerName = document.getElementById('player-name').value.trim();
    // NAME validation
    if (!playerName) {
      alert('Enter Name');
      return;
    }

    //img id
    let img = document.querySelector('.selected').dataset.imgid;

    
    //join room
    let room = await joinRoom(roomCode, playerName, img);
    

    if (room===null) {
      //room does not exist
      alert('Invalid Room Code!');
    } else if (!room.full) {
      //success!
      const {nextIndex} = room;

      const playerIndex = nextIndex;

      this.props.setRoom(roomCode, playerIndex);

    } else {
      // room is full
      alert('Sorry! This room is full!');
    }
  }


  renderContent = ()=> {
    if (this.props.entered) {
      if (this.props.host) {
        // you're the host
        return (
          <div className="column">
            <p>Welcome to the Party!</p>
            <p>Looks like you're the host!</p>
            <p>Tap Continue as soon as all the guests have arrived!</p>
            <div className="btn" onClick={this.startGame}>Continue</div>
          </div>
        )
      } else {
        return (
          <div className="column">
            <p>Welcome to the Party!</p>
            <p>Sit back, relax until everyone has joined!</p>
            <p>{this.props.hostName} will start the party as soon as everyone is in!</p>
          </div>
        )
      }
    } else {
      return (
        <div className="column">
          
          <form onSubmit={this.joinRoom}>

            <div>Room Code:</div>
            <input type="text" className="textbox" id="room-code" maxLength="4" autoComplete="off" spellCheck={false}></input>

            <div>Name:</div>
            <input type="text" className="textbox" id="player-name" maxLength="12" autoComplete="off" spellCheck={false}></input>
          
          </form>

          <div>Picture:</div>

          <ImgSelection />

          <div className="btn" onClick={this.joinRoom}>Join the Party!</div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="JoinRoom">
        {this.renderContent()}
      </div>
    )
  }
}

export default JoinRoom;