import React, {Component} from 'react';
import Video from './VideoBackground';
import Card from './ProfileCard';

import firebase from 'firebase';

class NewRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {players: []}

    this.goFullScreen = this.goFullScreen.bind(this);
  }

  componentDidMount() {
    this.createRoom();
    this.goFullScreen();
  }

  createRoom = ()=> {
    let roomCode = this.generateCode();

    document.getElementById('code').innerText = roomCode;
    
    firebase.database().ref(`rooms/${roomCode}`).set({
      open: true, players: []
    });

    firebase.database().ref(`rooms/${roomCode}`).on('value', data => this.updatePlayers(data));
  }

  generateCode = ()=> {
    let code = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 4; i++)
      code += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return code;
  }

  goFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
    (!document.mozFullScreen && !document.webkitIsFullScreen)) {               // current working methods
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  // addPlayerTest = ()=> {
  //   let names = ['Jacob','Brandon','Karen','Stephen','Jon','David','Emily','Shayla','Debra','Luis','Tasheda','Ethan','Frankie','Kevin','Adam','Amy','Catherine','Dhruv','Mia','Billy','Bob','Sally','AJ','Andrey'];
  //   let imgs = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  //   let name = names[Math.floor(Math.random() * names.length)];
  //   let img = imgs[Math.floor(Math.random() * imgs.length)];
  //   let roomCode = document.getElementById('code').innerText;
  //   let players = this.state.players.slice();
  //   players.push({name, img})

  //   firebase.database().ref(`rooms/${roomCode}`).set({
  //     players 
  //   });
  // }

  updatePlayers = data=> {
    let playersObj = data.toJSON().players; //players are stored as an object
    if (!playersObj) {
      return;
    }
    let players = []; //convert obj to arr
    for (let i = 0; i < 10; i++) {
      if (playersObj[i]) {
        players.push(playersObj[i]);
      } else {
        i=10;
      }
    }
    this.setState({players, open: true});
  }

  renderCards() {
    let players = this.state.players;
    return players.map((player, i) => {
      return <Card name={player.name} img={player.img} key={i} />
    });
  }

  render () {
    return (
      <div className="NewRoom">
      <Video videoURL='bg/newroom.mp4' />
      <div className="center-screen">
        <div className="column">
          <div className="row header">
            <div className="column">
              <div className="room-code">Room Code:</div>
              <div id="code">HJFA</div>
            </div>
          </div>

          <div className="row">
            <div className="players">
              {this.renderCards()}
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
};

export default NewRoom;