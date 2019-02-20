import React, {Component} from 'react';
import {joinRoom} from '../../actions';

class JoinRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {entered: false, vip: false, playerId: 0, roomCode: ''}
  }
  
  renderPictures = () => {
    let indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    let imgs = [];
    for (let i = 0; i < 9; i++) {
      let rndX = Math.floor(Math.random() * indices.length);
      let altText;
      switch(indices[rndX]){
        case 1:
          altText = 'Dog';
          break;
        case 2:
          altText = 'Parrot';
          break;
        case 3:
          altText = 'Dolphin';
          break;
        case 4:
          altText = 'Snake';
          break;
        case 5:
          altText = 'Eagle';
          break;
        case 6:
          altText = 'Horse';
          break;
        case 7:
          altText = 'Penguin';
          break;
        case 8:
          altText = 'Owl';
          break;
        case 9:
          altText = 'Goat';
          break;
        case 10:
          altText = 'Pug';
          break;
        case 11:
          altText = 'Frog';
          break;
        case 12:
          altText = 'Elephant';
          break;
        case 13:
          altText = 'Dinosaur';
          break;
        case 14:
          altText = 'Jaguar';
          break;
        case 15:
          altText = 'Fox';
          break;
        default:
          altText = 'Cat';
      }
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
    
    let vip = '';
    let entered = false;
    let playerId = 0;

    if (room===null) {
      //room does not exist
      alert('Invalid Room Code!');
    } else if (room.open) {
      //success!
      entered = true;

      if (room.players) {
        //you're not the first player to join
        vip = room.players['0'].name;
        playerId = room.players.length; //if there was 1 player already, your index=1, etc.
      }

      this.setState({entered, vip, playerId, roomCode});
    } else {
      // room is full
      alert('Sorry! This room is full!');
    }
  }

  renderContent = ()=> {
    if (this.state.entered) {
      if (this.state.playerId===0) {
        // you're the vip
        return (
          <div className="column">
            <p>Welcome to the Party!</p>
            <p>Looks like you're the host!</p>
            <p>Tap Continue as soon as all the guests have arrived!</p>
            <p>(Minimum 4 Players)</p>
            <div className="btn">Continue</div>
          </div>
        )
      } else {
        return (
          <div>
            <p>Welcome to the Party!</p>
            <p>Sit back, relax until everyone has joined!</p>
            <p>{this.state.vip} will start the party as soon as everyone is in!</p>
          </div>
        )
      }
    } else {
      return (
        <div>
          <div>Room Code:</div>
          <input type="text" className="textbox" id="room-code" maxLength="4"></input>
          

          <div>Name:</div>
          <input type="text" className="textbox" id="player-name" maxLength="12"></input>

          <div>Picture:</div>

          <div className="pictures">
            {this.renderPictures()}
          </div>

          <div className="btn" onClick={this.joinRoom}>JOIN the PARTY!</div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="JoinRoom">
        <div className="column">

          <div className="title1">Jacob's</div>
          <div className="title2">Game House</div>

          {this.renderContent()}

        </div>
      </div>
    )
  }
}

export default JoinRoom;