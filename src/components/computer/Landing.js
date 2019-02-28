import React, {Component} from 'react';

import {games} from '../../actions/games';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state=({showNotice:false, showInstructions: false});
  }

  renderContent(){
    if (this.state.showNotice) {
      return (
        <div>
          <p className="notice">Jacob's Game House is an interactive, multiplayer party game featuring music, voice, and sound effects.</p>
          <div className="btn" onClick={()=>this.props.switchGame(games.newRoom)}>Start the Party!</div>
          <div className="btn" onClick={()=>this.setState({showNotice: false})}>Back</div>
        </div>
      )
    } else if (this.state.showInstructions) {
      return (
        <div>
          <div className="instructions">
            <p>Jacob's Game House is a collection of interactive, multiplayer party games players interact with using their devices.</p>
            <p>To play, you will need:</p>
            <p>1 Display</p>
            <p>4+ Players</p>
            <p>A device for each player<br/>(Phones work great!)</p>
            <p>Games involve music, voice, and sound effects, so make sure your volume is turned on for the best experience.</p>
          </div>
          <div className="btn" onClick={()=>this.setState({showInstructions: false})}>Back</div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="row">
            <div className="column option" onClick={()=>this.setState({showNotice: true})}>
              <div className="icon"><i className="fas fa-tv"></i></div>
              <div>Display</div>
            </div>
            <div className="column option" onClick={this.props.useAsDevice}>
              <div className="icon"><i className="fas fa-tablet-alt"></i></div>
              <div>Input</div>
            </div>
          </div>
          <div className="row">
            <div className="btn" onClick={()=>this.setState({showInstructions: true})}>How to Play</div>
          </div>
        </div>
      )
    }
  }

  render () {
    return (
      <div className="Landing">

          <div className="column">

            <div className="title1">Jacob's</div>
            <div className="title2">Game House</div>

            {this.renderContent()}
          </div>

      </div>
    )
  }
};

export default Landing;