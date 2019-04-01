import React, {Component} from 'react';
import {joinRoom} from '../../../actions';
import {signInWithGoogle, updateUser} from '../../../actions/auth';
import ImgSelection from './ImgSelection';
import ImgCrop from './ImgCrop';
import {Link} from 'react-router-dom';
import ProfilePicture from './ProfilePicture';

class JoinRoom extends Component {

  constructor(props) {
    super(props);
    this.state={
      roomCode: '',
      playerName: '',
      userImg: null,
      uploadedImg: null
    }
  }

  componentDidMount() {
    // test mode
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      const testNames = ['Jacob','Brandon','Karen','Stephen','Shayla','Jon','Debra','David','Emily','Luis','Tasheda','Ethan','Ariel'];
      const playerName = testNames[Math.floor(Math.random()*testNames.length)];
      this.setState({playerName, roomCode: 'TEST'});
    }
  }

  componentDidUpdate(oldProps) {
    const {user} = this.props;
    if(user && (!oldProps.user || user.name !== oldProps.user.name)) {
      const playerName = user.name.substring(0, 12)
      this.setState({playerName, userImg: user.img});
    }
  }

  joinRoom = async () => {

    let roomCode = this.state.roomCode.toUpperCase();
    let playerName = this.state.playerName.trim();

    if (this.props.user) updateUser({name: playerName});

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
      img = this.state.userImg;
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

  handleNewImage = img=> {
    if (img) {
      this.setState({userImg: img});
      updateUser({img});
    };
    this.setState({uploadedImg: null});
  }

  renderContent = ()=> {
    const {user} = this.props;
    const {userImg, uploadedImg, playerName} = this.state;
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
      if (uploadedImg) {
        return <div><ImgCrop img={uploadedImg} returnImage={this.handleNewImage} /></div>;
      } else {
        return (
          <div className="column">
            <div>Name:</div>
            {nameInput}
            <div>Picture:</div>
            <ProfilePicture img={userImg} name={user.name} handleFileSelect={uploadedImg=>this.setState({uploadedImg})}/>
            {join}
          </div>
        )
      }
    } else {
      return (
        <div className="column">

            <div id="sign-in">
              <div>Sign In (Optional):</div>
              <div className="row">

                {/* <div id="facebook"><i className="fab fa-facebook-square"></i></div> */}

                <div id="google" onClick={signInWithGoogle}><i className="fab fa-google-plus-square"></i></div>

              </div>
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