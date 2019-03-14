import React, {Component} from 'react';

import Ad from './Ad';

import {sendInput} from '../../actions';

class SelectGame extends Component {

  constructor(props) {
    super(props);
    this.state = {host: props.host};
  }

  renderContent() {
    if (this.state.host) {
      return (
        <div className="column">
          <img alt="up" src="assets/img/controls/select.svg" id="select" onClick={()=>this.handleKeyPress('select')} />
          <div className="row arrows">
            <img alt="up" src="assets/img/controls/up.svg" id="up" onClick={()=>this.handleKeyPress('up')} />
            <img alt="down" src="assets/img/controls/down.svg" id="down" onClick={()=>this.handleKeyPress('down')} />
          </div>
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

  handleKeyPress = key=> {
    const {code, playerIndex} = this.props;
    const id = new Date().getTime();
    sendInput(code, playerIndex, {key, id});
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