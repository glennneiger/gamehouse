import React, {Component} from 'react';
import {selectGame} from '../../actions';
import {games} from '../../actions/games';

import Ad from './Ad';

class SelectGame extends Component {

  renderContent() {
    if (this.props.vip) {
      return (
        <div className="column">
          <p>Select Game:</p>
            <div className="btn" onClick={()=>selectGame(this.props.code, games.storyTime)}>Story Time</div>
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
      <div className="SelectGame">
        <div className="column">

          {this.renderContent()}
          
          <Ad/>
        </div>
      </div>
    )
  }
}

export default SelectGame;