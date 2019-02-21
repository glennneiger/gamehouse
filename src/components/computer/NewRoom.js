import React, {Component} from 'react';
import Video from './VideoBackground';
import Card from './ProfileCard';


class NewRoom extends Component {

  componentDidMount() {
    this.goFullScreen();
  }


  goFullScreen = ()=> {
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




  renderCards() {
    let players = this.props.room.players;
    return players.map((player, i) => {
      return <Card name={player.name} img={player.img} key={i} />
    });
  }

  render () {
    return (
      <div className="NewRoom">
      <Video video='newroom' />
      <div className="center-screen">
        <div className="column">
          <div className="row header">
            <div className="column">
              <div className="room-code">Room Code:</div>
              <div id="code">{this.props.room.code}</div>
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