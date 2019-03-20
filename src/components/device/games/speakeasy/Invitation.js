


import  React, {Component} from 'react';

import {sendInput} from '../../../../actions';

export default class Speakeasy extends Component {

  handleSend = selection => {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, selection, true);
    this.props.handleSubmit();
  }

  render() {
    const players = Object.values(this.props.request.message);    
    let options = [];
    players.forEach(player => {
      options.push(<div className="btn" key={player.index} onClick={()=>this.handleSend(player.index)}>{player.name}</div>)
    });

    return <div className="Speakeasy Invitation column">
      <div className="font-large header">Send Invitation:</div>
      {options}
    </div>
  }
}


//message : array [players who can be invited{name, index}]
