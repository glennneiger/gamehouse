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
      <div className="StoryTimeWriteLine">
        <div>Fill in the blank:</div>
        <div>{this.props.requestMessage}</div>
        <input type="text" className="textbox" id="write-line" maxLength="100" onChange={this.updateText}></input>
        <div className="btn" onClick={this.handleSubmit}>Submit</div>
      </div>
    )
  }
}