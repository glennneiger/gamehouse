import React, {Component} from 'react';
import {selectGame} from '../../actions';
import {games} from '../../actions/games';

import Ad from './Ad';

class SelectGame extends Component {

  renderContent() {
    if (this.props.host) {
      return (
        <div className="column">
          <p>Select Game:</p>
            <div className="btn" onClick={()=>selectGame(this.props.code, games.storyTime)}>Story Time</div>
        </div>
      )
    } else {
      return (
        <div className="column">
          <p> 
            Your host will select the next game.
          </p>
          <Ad />
        </div>
      )
    }
  }

  render() {
    return (
      <div className="SelectGame">

        {this.renderContent()}
          
      </div>
    )
  }
}

export default SelectGame;