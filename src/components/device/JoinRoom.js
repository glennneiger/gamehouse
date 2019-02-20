import React, {Component} from 'react';
import {joinRoom} from '../../actions';

class JoinRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {entered: false, vip: false, playerId: 0}
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

  joinRoom = () => {
    let roomCode = document.getElementById('room-code').value.toUpperCase();
    if (!roomCode.trim()) return;
    let nameInput = document.getElementById('player-name').value;
    if (!nameInput.trim()) return;

    let playerName = nameInput.trim().charAt(0).toUpperCase() + nameInput.trim().slice(1); //capitalize name
    let img = document.querySelector('.selected').dataset.imgid;

    joinRoom(roomCode, playerName, img);
    
  }

  render() {
    return (
      <div className="JoinRoom">
        <div className="column">

          <div className="title1">Jacob's</div>
          <div className="title2">Game House</div>

          <div>Room Code:</div>
          <input type="text" className="textbox" id="room-code" maxLength="4"></input>

          <div>Name:</div>
          <input type="text" className="textbox" id="player-name" maxLength="12"></input>

          <div>Picture:</div>

          <div className="pictures">
            {this.renderPictures()}
          </div>

          <div className="btn" onClick={this.joinRoom}>{this.state.entered ? 'UPDATE' : 'JOIN!'}</div>


        </div>
      </div>
    )
  }
}

export default JoinRoom;