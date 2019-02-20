import React, {Component} from 'react';
import Video from './VideoBackground';
import Card from './ProfileCard';

class NewRoom extends Component {

  constructor(props) {
    super(props);

    this.state = {players: [
      {name: 'Jacob', img: '00'},
      {name: 'Brandon', img: '01'}
    ]}

    this.addPlayer = this.addPlayer.bind(this);
    this.goFullScreen = this.goFullScreen.bind(this);
  }

  componentDidMount() {
    this.goFullScreen();
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

  addPlayer(name, img) {
    let players = this.state.players.slice();
    // max 10 players
    if (players.length===10) { 
      return;
    }
    players.push({name, img});
    this.setState({players});
  }

  renderCards() {
    let players = this.state.players;
    return players.map((player, i) => {
      return <Card name={player.name} img={'0'+ i} key={i} />
    });
  }

  render () {
    return (
      <div className="NewRoom" onClick={()=>this.addPlayer('Jacob','02')}>
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