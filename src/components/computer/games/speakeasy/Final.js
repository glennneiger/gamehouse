import PlayerGrid from '../../PlayerGrid';

import React, {Component} from 'react';

import {screens} from './helpers';

import {getPlayersFromIndices} from '../../../../helpers/functions';
import {games} from '../../../../helpers/games';
import {inputRequest} from '../../../../actions/';
import {requests} from '../../../../actions/requestTypes';

export default class Final extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playersToShow: []
    }
  }

  componentDidMount() {
    const {code, hostIndex} = this.props.room;
    const {players} = this.props;
    const {agents} = this.props;
    const playersToShow = getPlayersFromIndices(agents, players);
    this.setState({playersToShow})

    setTimeout(() => {
      // ask host (player[hostIndex]) if play again
      inputRequest(code, requests.playAgain, null, hostIndex, this.handleReceiveInput);
      document.getElementById('play-again').classList.add('slide-in-from-bottom');
    }, 1000);
  }

  handleReceiveInput = input=>{
    if (input.message===true) { //playAgain
      this.props.switchScreen(screens.intro);
    } else {
      // go back to lobby
      this.props.switchGame(games.gameRoom);
    }
  }

  render() {

    return (
      <div className="Speakeasy Final">
        <div className="v-15"></div>
        <div className="v-20 slide-in-from-top header">Agents</div>
        <div id="grid" className="v-30">
          <PlayerGrid max={4} rows={1} players={this.state.playersToShow} />
        </div>
        <div className="v-15"></div>
        <div className="v-20" id="play-again">Play Again?</div>
      </div>
    )
  }
}