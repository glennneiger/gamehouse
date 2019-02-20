import React, { Component } from 'react';

import JoinRoom from './device/JoinRoom';

class Device extends Component {

  constructor(props) {
    super(props);

    this.state={game: 'join-room'};

    this.switchGame = this.switchGame.bind(this);
  }

  switchGame(game) {
    this.setState({game});
  }

  render() {
    switch (this.state.game) {
      default:
        return (
          <JoinRoom switchGame = {this.switchGame} />
        );
     }
  }
}

export default Device;

