import React, {Component} from 'react';
import PlayerGrid from './PlayerGrid';


class NewRoom extends Component {

  componentDidMount() {
    this.props.playAudio('music','newroom');
    this.props.playVideo('newroom');
    this.props.preloadMusic('lobby');
    this.props.preloadVideo('lobby');
  }

  render () {
    return (
      <div className="NewRoom">

        <div className="column">
          <div className="row header">
            <div className="column">
              <div className="room-code">Room Code:</div>
              <div id="code">{this.props.room.code}</div>
            </div>
          </div>


          <PlayerGrid players={this.props.room.players} />


          <div className="row website">
            &nbsp;<i className="fas fa-tablet-alt"></i>&nbsp;partyhouse.tv
          </div>

        </div>

      </div>
    )
  }
};

export default NewRoom;