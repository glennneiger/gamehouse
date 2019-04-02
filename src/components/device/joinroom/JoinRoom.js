import React, {Component} from 'react';
import {joinRoom} from '../../../actions';
import {updateUser} from '../../../actions/auth';
import ImgSelection from './ImgSelection';
import {Link} from 'react-router-dom';
import CustomizeAccount from '../../account/Customize';
import SignIn from '../../account/SignIn';

class JoinRoom extends Component {

  constructor(props) {
    const playerName = props.user ? props.user.name : '';
    super(props);
    this.state={
      roomCode: '',
      playerName
    }
  }

  componentDidMount = async ()=> {
    // test mode
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      const testNames = ['Jacob','Brandon','Karen','Stephen','Shayla','Jon','Debra','David','Emily','Luis','Tasheda','Ethan','Ariel'];
      const playerName = this.props.user ? this.state.playerName : testNames[Math.floor(Math.random()*testNames.length)];
      this.setState({playerName, roomCode: 'TEST'});
    }
  }

  componentDidUpdate(oldProps) {
    const {user} = this.props;
    if(user && (!oldProps.user || user.name !== oldProps.user.name)) {
      const playerName = user.name;
      this.setState({playerName});
    }
  }

  joinRoom = async () => {

    let roomCode = this.state.roomCode.toUpperCase();
    let playerName = this.state.playerName.trim();

    if (playerName && this.props.user) updateUser({name: playerName});

    //ROOM CODE validation
    if (!roomCode.trim()) {
      alert('Enter Room Code');
      return;
    }

    // NAME validation
    if (!playerName) {
      alert('Enter Name');
      return;
    }

    //img id
    let img;
    if (this.props.user) {
      img = this.props.user.img;
    } else {
      img = parseInt(document.querySelector('.selected').dataset.imgid);
    }

    
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

  handleInputChange = event=> {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }


  renderContent = ()=> {
    const {playerName} = this.state;
    const {user} = this.props;
    const nameInput = <input 
      type="text" 
      className="textbox" 
      id="player-name"
      maxLength="12" 
      autoComplete="off" 
      spellCheck={false} 
      name="playerName" 
      value={playerName}
      onChange={this.handleInputChange}
    />
    const join = <div className="btn" onClick={this.joinRoom}>Join the Party!</div>

    if (user===false) {
      return <div><div className="lds-facebook"><div></div><div></div><div></div></div></div>
    } else if (user) {
      return (
        <div className="column"> 
          <CustomizeAccount user={user} handleInputChange={playerName=>this.setState({playerName})} name={playerName} />
          {join}
        </div>
      )
    } else {
      return (
        <div className="column">

            <div id="sign-in">
              <div>Sign In (Optional):</div>
              <SignIn />
            </div>


            <div id="guest-header">Play as Guest:</div>

            <div id="guest-box">
              <div>Name:</div>
              {nameInput}

              <div>Picture:</div>

              <ImgSelection />
            </div>
          {join}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="JoinRoom">
        <div className="column">
          
          <form onSubmit={this.joinRoom}>

            <div>Room Code:</div>
            <input 
              type="text" 
              className="textbox" 
              id="room-code"
              maxLength="4" 
              autoComplete="off" 
              spellCheck={false} 
              name="roomCode" 
              value={this.state.roomCode}
              onChange={this.handleInputChange}
            />

            {this.renderContent()}
   
            <Link to="/" className="btn-link">Back</Link>

          </form>
        </div>
      </div>
    )
  }
}

export default JoinRoom;