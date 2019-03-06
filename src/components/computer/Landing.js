import React, {Component} from 'react';

import {games} from '../../actions/games';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state=({showNotice:false, showInstructions: false, showCredits: false});
  }

  renderContent(){
    if (this.state.showNotice) {
      return (
        <div>
          <p className="notice">Party House is an interactive, multiplayer party game featuring music, voice, and sound effects.</p>
          <div className="btn" onClick={()=>this.props.switchGame(games.newRoom)}>Start the Party!</div>
          <div className="btn" onClick={()=>this.setState({showNotice: false})}>Back</div>
        </div>
      )
    } else if (this.state.showInstructions) {
      return (
        <div>
          <div className="instructions">
            <p>Party House is a collection of interactive, multiplayer party games players interact with using their devices.</p>
            <p>To play, you will need:</p>
            <p>1 Display</p>
            <p>3-16 Players</p>
            <p>A device for each player<br/>(Phones work great!)</p>
            <p>Games involve music, voice, and sound effects, so make sure your volume is turned on for the best experience.</p>
          </div>
          <div className="btn" onClick={()=>this.setState({showInstructions: false})}>OK</div>
        </div>
      )
    } else if (this.state.showCredits) {
      return (
        <div>
          <div className="instructions">
            <p>Created By:<br />Jacob Garcia</p>
            <p>Music:<br />
            Zazie, Local Forecast, Doobly Doo<br />
            by Kevin MacLeod (incompetech.com)<br />
            Licensed under the Creative Commons 3.0:<br />By Attribution license.</p>
          </div>
          <div className="btn" onClick={()=>this.setState({showCredits: false})}>OK</div>
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
            <div className="link" onClick={()=>this.setState({showInstructions: true})}>How to Play</div>
            <div className="link" onClick={()=>this.setState({showCredits: true})}>Credits</div>

        </div>
      )
    }
  }

  render () {
    return (
      <div className="Landing">

          <div className="column">
            <img  className="logo" src="./assets/img/logo.svg" alt="Party House" />
            {this.renderContent()}
          </div>

      </div>
    )
  }
};

export default Landing;