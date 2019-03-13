import React, {Component} from 'react';
import {joinRoom, selectGame, watchForChange, removeWatcher, incrementSessions} from '../../actions';
import {games} from '../../actions/games';

class JoinRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {playerId: 0, enoughPlayers: false, roomCode: null, players: [], host: props.host, hostName: props.hostName}
  }

  componentDidMount() {
    // test mode
    if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && !this.props.entered) {
      document.getElementById('room-code').value="TEST";
      const testNames = ['Jacob','Brandon','Karen','Stephen','Shayla','Jon','Debra','David','Emily','Luis','Tasheda','Ethan','Ariel'];
      document.getElementById('player-name').value = testNames[Math.floor(Math.random()*testNames.length)];
    }
  }

  componentWillUnmount() {
    const {roomCode} = this.state;
    if (roomCode) {
      removeWatcher(roomCode, 'players');
      removeWatcher(roomCode, 'hostIndex');
    }
  }

  componentDidUpdate(oldProps) {
    const {host, hostName} = this.props;
    if(oldProps.host !== host) {
      this.setState({host: host});
    }
    if(oldProps.hostName !== hostName) {
      this.setState({hostName: hostName});
    }
  }

  startGame = () => {
    if (!this.state.enoughPlayers) {
      alert('You must have at least 3 players to continue!');
      return;
    }
    const {code} = this.props;
    selectGame(code, games.gameRoom);
    incrementSessions();
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
    let hostName = '';
    let playerId = 0;

    if (room===null) {
      //room does not exist
      alert('Invalid Room Code!');
    } else if (!room.full) {
      //success!
      const {hostIndex, nextIndex, totalPlayers} = room;
      let players = room.players || {};

      if (!totalPlayers) {
        hostName = playerName;
      } else {
        hostName = players[hostIndex].name;
      }

      playerId = nextIndex;

      const host = playerId===hostIndex;
      players[playerId] = {name: playerName, img};

      watchForChange(roomCode, 'hostIndex', this.updateHost);
      watchForChange(roomCode, 'players', this.updatePlayers);

      this.setState({playerId, players, roomCode, host, hostName});
      this.props.setRoom(roomCode, playerId, host, hostName);

    } else {
      // room is full
      alert('Sorry! This room is full!');
    }
  }

  updatePlayers = async data=> {
    const playersObj = await data.toJSON();
    if (!playersObj) return;
    const playersArr = Object.values(playersObj);
    const enoughPlayers = playersArr.length > 2;
    this.setState({enoughPlayers, players: playersObj});
  }

  updateHost = async data=> {
    const hostIndex = await data.toJSON();
    if (!hostIndex) return;
    const {roomCode, playerId, players} = this.state;
    const host = hostIndex === playerId;
    const hostName = players[hostIndex].name;
    this.props.setRoom(roomCode, playerId, host, hostName);
  }

  renderContent = ()=> {
    if (this.props.entered) {
      if (this.state.host) {
        // you're the host
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
            <p>{this.state.hostName} will start the party as soon as everyone is in!</p>
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