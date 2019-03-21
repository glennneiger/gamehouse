import React, {Component} from 'react';
import PlayerGrid from '../other/PlayerGrid';


class NewRoom extends Component {

  constructor(props) {
    super(props);
    this.state= {
      ready: false //wait for video to load
    }
  }

  componentDidMount() {
    this.props.playAudio('music','newroom');
    this.props.playVideo('newroom', ()=>{this.setState({ready: true})});
    this.props.preloadMusic('lobby');
    this.props.preloadVideo('lobby');
  }

  render () {
    if (this.state.ready) {
      return (
        <div className="NewRoom column">
      

          <div className="v-25 center">
            <div className="darken header center">
              <div className="room-code">Room Code:</div>
              <div id="code">{this.props.room.code}</div>
            </div>
          </div>

          <div className="v-60 grid">
            <PlayerGrid players={this.props.room.players} />
          </div>

          <div className="v-15 center">
            <div className="darken website center">
              <div>
                &nbsp;<i className="fas fa-tablet-alt"></i>&nbsp;partyhouse.tv
              </div>
            </div>
          </div>


        </div>
      )
    } else {
      return <div className="center-screen"><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
    }
  }
};

export default NewRoom;