import React, {Component} from 'react';

import Ad from './Ad';

import {sendMenuSelection} from '../../../actions';

class SelectGame extends Component {

  renderContent() {
    if (this.props.host) {
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
            {this.props.hostName} will select the next game.
          </p>
          <Ad />
        </div>
      )
    }
  }

  handleKeyPress = key=> {
    const {code} = this.props;
    sendMenuSelection(code, key);
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