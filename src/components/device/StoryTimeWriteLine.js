import React, {Component} from 'react';

import {sendInput, submitInput} from '../../actions';

export default class StoryTimeWriteLine extends Component {

  updateText = e=> {
    sendInput(this.props.code, this.props.playerIndex, e.target.value);
  }

  handleSubmit = ()=> {
    let text = document.getElementById('write-line').value;
    submitInput(this.props.code, this.props.playerIndex, text);
    this.props.handleSubmit();
  }

  render() {
    return (
      <div className="StoryTime">
        <div>Fill in the blank:</div>
        <div className="font-large">{this.props.prompt}...</div>
        <textarea className="textbox" id="write-line" maxLength="100" rows="2" onChange={this.updateText}></textarea>
        <div className="row">
          <div className="btn" onClick={this.handleSubmit}>Submit</div>
        </div>
      </div>
    )
  }
}