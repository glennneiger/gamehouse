import React, {Component} from 'react';
import {selectGame, incrementSessions} from '../../../actions';
import {games} from '../../../helpers/games';

class JoinRoom extends Component {

  startGame = () => {
    const {code} = this.props;
    selectGame(code, games.gameRoom);
    incrementSessions();
  }

  renderContent = ()=> {
    if (this.props.host) {
      // you're the host
      return (
        <div className="column">
          <p>Welcome to the Party!</p>
          <p>Looks like you're the host!</p>
          <p>Tap Continue as soon as all the guests have arrived!</p>
          <div className="btn" onClick={this.startGame}>Continue</div>
        </div>
      )
    } else {
      return (
        <div className="column">
          <p>Welcome to the Party!</p>
          <p>Sit back, relax until everyone has joined!</p>
          <p>{this.props.hostName} will start the party as soon as everyone is in!</p>
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