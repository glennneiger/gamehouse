


import  React, {Component} from 'react';

import {sendInput} from '../../../../actions';

export default class Speakeasy extends Component {

  handleAcknowledge = () => {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, playerIndex, true);
    this.props.handleSubmit();
  }

  render() {

    const role = this.props.request.message;

    return <div className="Speakeasy column">
      <div>Your Role:</div>
      <div className="font-large">{role}</div>
      <div className="btn" onClick={this.handleAcknowledge}>Continue</div>
    </div>
  }
}
