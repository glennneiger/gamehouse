import React, { Component } from 'react';

import Landing from './computer/Landing';
import NewRoom from './computer/NewRoom';

class Computer extends Component {

  constructor(props) {
    super(props);

    this.state={game: 'landing'};

    this.switchGame = this.switchGame.bind(this);
  }

  switchGame(game) {
    this.setState({game});
  }

  render() {
    switch (this.state.game) {
      case 'new-room':
        return (
          <NewRoom />
        )
      default:
        return (
          <Landing switchGame = {this.switchGame} />
        );
     }
  }
}

export default Computer;
