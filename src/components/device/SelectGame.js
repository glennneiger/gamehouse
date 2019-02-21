import React, {Component} from 'react';
import {selectGame} from '../../actions';
import {games} from '../../actions/games';

import Logo from './Logo';

class SelectGame extends Component {

  renderContent() {
    if (this.props.vip) {
      return (
        <div>
          <p>Select Game:</p>
            <div className="btn" onClick={()=>selectGame(games.storyTime)}>Story Time</div>
        </div>
      )
    } else {
      return (
        <p>
          Your host will select the next game.
        </p>
      )
    }
  }

  render() {
    return (
      <div className="JoinRoom">
        <div className="column">

          <Logo />

          {this.renderContent()}

        </div>
      </div>
    )
  }
}

export default SelectGame;