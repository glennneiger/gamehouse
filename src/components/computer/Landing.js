import React, {Component} from 'react';
import Video from './VideoBackground';

import {games} from '../../actions/games';

class Landing extends Component {

  render () {
    return (
      <div className="Landing">
        <Video video='home' />
        <div className="center-screen">

          <div className="column">

            <div className="title1">Jacob's</div>
            <div className="title2">Game House</div>

            <div className="row">
              <div className="column option" onClick={()=>this.props.switchGame(games.newRoom)}>
                <div className="icon"><i className="fas fa-tv"></i></div>
                <div>Display</div>
              </div>
              <div className="column option" onClick={this.props.useAsDevice}>
                <div className="icon"><i className="fas fa-tablet-alt"></i></div>
                <div>Input</div>
              </div>
            </div>

            <div className="row">
              <div className="btn">How to Play</div>
            </div>

          </div>

        </div>
      </div>
    )
  }
};

export default Landing;