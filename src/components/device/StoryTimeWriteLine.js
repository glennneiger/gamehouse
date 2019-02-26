import React, {Component} from 'react';

export default class StoryTimeWriteLine extends Component {

  render() {
    return (
      <div className="StoryTimeWriteLine">
        <div>Fill in the blank:</div>
        <div>{this.props.requestMessage}</div>
        <input type="text" className="textbox" id="write-line" maxLength="40"></input>
      </div>
    )
  }
}