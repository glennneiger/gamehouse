import React, {Component} from 'react';

import {sendInput} from '../../../../actions';

export default class StoryTimeVote extends Component {

  submitVote = vote=> {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, vote, true);
    this.props.handleSubmit();
  }

  renderOptions() {
    const {message} = this.props.request;
    let options = Object.values(message);
    return options.map((option, i)=>(
      <img alt={option.name} key={i} data-imgid={option.img} id={'img-' + i} src={`./assets/img/profiles/${('0' + option.img).slice(-2)}.jpg`}  onClick={()=>this.submitVote(option.index)}></img>
    ));
  }

  render() {
    return (
      <div className="StoryTime column">
        <div className="font-large">Vote!</div>
        <div className="row vote">{this.renderOptions()}</div>
      </div>
    )
  }
}