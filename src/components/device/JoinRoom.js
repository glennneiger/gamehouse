import React, {Component} from 'react';
import {joinRoom, selectGame, watchForChange, removeWatcher} from '../../actions';
import {games} from '../../actions/games';

class JoinRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {playerId: 0, enoughPlayers: false, roomCode: null}
  }

  componentWillUnmount() {
    const {roomCode} = this.state;
    if (roomCode) {
      removeWatcher(roomCode, 'players');
    }
  }

  startGame = () => {
    if (!this.state.enoughPlayers) {
      alert('You must have at least 3 players to continue!');
      return;
    }
    selectGame(this.props.code, games.gameRoom);
  }
  
  renderPictures = () => {
    let indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    const altTexts = ['Cat','Dog','Parrot','Dolphin','Snake','Eagle','Horse','Penguin','Owl','Goat','Pug','Frog','Elephant','Dinosaur','Jaguar','Fox'];
    let imgs = [];
    for (let i = 0; i < 9; i++) {
      let rndX = Math.floor(Math.random() * indices.length);
      let altText = altTexts[indices[rndX]];
      imgs.push(
        <img alt={altText} key={i} data-imgid={indices[rndX]} id={'img-' + i} src={`./assets/img/profiles/${('0' + indices[rndX]).slice(-2)}.jpg`} className={!i ? 'selected' : ''} onClick={()=>this.selectImg(i)}></img>
      )
      indices.splice(rndX,1);
    }
    return imgs;
  }

  selectImg = (index) => {
    document.querySelector('img.selected').classList.remove('selected');
    document.querySelector(`img#img-${index}`).classList.add('selected');
  }

  joinRoom = async () => {

    let roomCode = document.getElementById('room-code').value.toUpperCase();
    //ROOM CODE validation
    if (!roomCode.trim()) {
      alert('Enter Room Code');
      return;
    }

    let nameInput = document.getElementById('player-name').value;
    // NAME validation
    if (!nameInput.trim()) {
      alert('Enter Name');
      return;
    }

    //auto capitalize name
    let playerName = nameInput.trim().charAt(0).toUpperCase() + nameInput.trim().slice(1); 
    //img id
    let img = document.querySelector('.selected').dataset.imgid;

    //join room
    let room = await joinRoom(roomCode, playerName, img);
    
    let vipName = '';
    let playerId = 0;

    if (room===null) {
      //room does not exist
      alert('Invalid Room Code!');
    } else if (room.open) {
      //success!

      if (room.players) {
        //you're not the first player to join
        vipName = room.players['0'].name;
        for (let i=1; i<16; i++) {
          if (!room.players[i]) {
            playerId = i;
            break;
          }
        }
      } else {
        //you are the first, making you the host/VIP 
        watchForChange(roomCode, 'players', this.seeIfEnoughPlayers);
        this.setState({roomCode});
      }

      this.setState({playerId});
      this.props.setRoom(roomCode, playerId, vipName);

    } else {
      // room is full
      alert('Sorry! This room is full!');
    }
  }

  seeIfEnoughPlayers = async data=> {
    const players = await data.toJSON();
    if (players && players[2]) {
      this.setState({enoughPlayers: true});
    }
  }

  renderContent = ()=> {
    if (this.props.entered) {
      if (this.state.playerId===0) {
        // you're the vip
        return (
          <div className="column">
            <p>Welcome to the Party!</p>
            <p>Looks like you're the host!</p>
            <p>Tap Continue as soon as all the guests have arrived!</p>
            <p>(Minimum 3 Players)</p>
            <div className="btn" onClick={this.startGame}>Continue</div>
          </div>
        )
      } else {
        return (
          <div className="column">
            <p>Welcome to the Party!</p>
            <p>Sit back, relax until everyone has joined!</p>
            <p>{this.props.vipName} will start the party as soon as everyone is in!</p>
          </div>
        )
      }
    } else {
      return (
        <div className="column">
          <div>Room Code:</div>
          <input type="text" className="textbox" id="room-code" maxLength="4"></input>
          

          <div>Name:</div>
          <input type="text" className="textbox" id="player-name" maxLength="12"></input>

          <div>Picture:</div>

          <div className="pictures">
            {this.renderPictures()}
          </div>

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