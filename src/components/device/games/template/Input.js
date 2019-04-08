
import  React, {Component} from 'react';

import {sendInput} from '../../../../actions';

export default class Input extends Component {

  handleSend = selection => {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, selection, true);
    this.props.handleSubmit();
  }

  render() {

    // const message = this.props.request.message;

    return <div className="Game column">
      <div className="btn" onClick={()=>this.handleSend('Input')}>Click Me</div>
    </div>
  }
}


