import React, {Component} from 'react';

import {sendInput} from '../../../actions';
import Ad from '../other/Ad';

export default class PlayAgain extends Component {

  skip = ()=> {
    const {code, playerIndex, handleSubmit, request} = this.props;
    handleSubmit();
    sendInput(code, playerIndex, request.type, true, true);
  }

  render() {
    return (
      <div className="Skip column">
        <Ad />
        <div className="btn" onClick={this.skip}>Skip</div>
      </div>
    )
  }
}