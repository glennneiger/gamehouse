import React, {Component} from 'react';

import {sendInput} from '../../../../actions';

import Timer from '../../other/Timer';

export default class StoryTimeWriteLine extends Component {

  updateText = e=> {
    const {code, playerIndex, request} = this.props;
    sendInput(code, playerIndex, request.type, e.target.value, false);
  }

  handleSubmit = ()=> {
    const text = document.getElementById('write-line').value;
    const {code, playerIndex, request} = this.props;
    sendInput(code, playerIndex, request.type, text, true);
    this.props.handleSubmit();
  }

  render() {
    const prompt = this.props.request.message;
    return (
      <div className="StoryTime">
        <Timer code={this.props.code} />
        <div>Fill in the blank:</div>
        <div className="font-large">{prompt}...</div>
        <textarea className="textbox" id="write-line" maxLength="120" rows="2" onChange={this.updateText}></textarea>
        <div className="row">
          <div className="btn" onClick={this.handleSubmit}>Submit</div>
        </div>
      </div>
    )
  }
}