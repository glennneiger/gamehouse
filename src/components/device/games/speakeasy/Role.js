


import  React, {Component} from 'react';

import {sendInput} from '../../../../actions';

export default class Speakeasy extends Component {

  handleAcknowledge = () => {
    const {code, playerIndex, request} = this.props;
    sendInput(code, playerIndex, request.type, playerIndex, true);
    this.props.handleSubmit();
  }

  render() {

    const role = this.props.request.message;

    return <div className="Speakeasy Role column">
      <div className="font-large">Your Role:</div>
      <div id="role">{role}</div>
      <div className="btn" onClick={this.handleAcknowledge}>Continue</div>
    </div>
  }
}
