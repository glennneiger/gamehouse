import React, {Component} from 'react';
import Card from './ProfileCard';


class NewRoom extends Component {

  componentDidMount() {
    this.props.playAudio('music','newroom');
    this.props.playVideo('newroom');
    this.props.preloadMusic('lobby');
    this.props.preloadVideo('lobby');
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

          <div className="row website">
            &nbsp;<i className="fas fa-tablet-alt"></i>&nbsp;partyhouse.tv
          </div>

        </div>

      </div>
    )
  }
};

export default NewRoom;