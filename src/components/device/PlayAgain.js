import React, {Component} from 'react';

import {submitInput, selectGame} from '../../actions';
import {games} from '../../actions/games';

export default class PlayAgain extends Component {

  respond = playAgain=> {
    const {code} = this.props;
    submitInput(code, 0, playAgain);
    if (!playAgain) {
      selectGame(code, games.gameRoom);
    }
  }

  render() {
    return (
      <div className="column">
        <p>Play Again?</p>
        <div className="btn" onClick={()=>this.respond(true)}>Yes</div>
        <div className="btn" onClick={()=>this.respond(false)}>No</div>
      </div>
    )
  }
}