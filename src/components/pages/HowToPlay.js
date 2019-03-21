import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import Logo from './Logo';

export default class HowToPlay extends Component {

  render() {
    return (
      <div className="device page">
        <div className="column">
          <Logo />
          <div className="content">
            <p>Party House Games is a collection of interactive, multiplayer party games players interact with using their devices.</p>
            <p>To play, get a group of 3-16 players together.</p>
            <p>Log into partyhouse.tv on your computer or TV, and click Start the Party. This will serve as a shared display for all players.</p> 
            <p>Players will log into the same website on their phones. From your phone, tap Join Party.</p>
            <p>Enter the room code shown on the screen. From here on, you'll have full control of the game from your phone.</p>
            <p>Games involve music, voice, and sound effects, so make sure your computer or TV volume is turned on for the best experience.</p>
          </div>
          <Link to="/" className="btn">Back</Link>
        </div>
      </div>
    )
  }
}

