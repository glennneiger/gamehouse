import React, {Component} from 'react';

import {sendInput} from '../../../../actions';

export default class StoryTimeWriteLine extends Component {

  updateText = e=> {
    sendInput(this.props.code, this.props.playerIndex, e.target.value, false);
  }

  handleSubmit = ()=> {
    let text = document.getElementById('write-line').value;
    sendInput(this.props.code, this.props.playerIndex, text, true);
    this.props.handleSubmit();
  }

  render() {
    const prompt = this.props.request.message;
    return (
      <div className="StoryTime">
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