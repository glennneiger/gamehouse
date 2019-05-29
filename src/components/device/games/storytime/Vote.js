import React, {Component} from 'react';

import {sendInput} from '../../../../actions';

import Timer from '../../other/Timer';

export default class StoryTimeVote extends Component {

  submitVote = vote=> {
    const {code, playerIndex, request} = this.props;
    sendInput(code, playerIndex, request.type, vote, true);
    this.props.handleSubmit();
  }

  renderOptions() {
    
    const {message} = this.props.request;
    let options = Object.values(message);
    return options.map((option, i)=>{
      const {img} = option;
      let src;
      // img is either an index (representing an animal pic) or a constum img url
      if (Number.isInteger(img)) {
        src=`./assets/img/profiles/${('0' + img).slice(-2)}.jpg`;
      } else {
        src = img;
      }
      return (
        <img alt={option.name} key={i} id={'img-' + i} src={src}  onClick={()=>this.submitVote(option.index)}></img>
      )
    });
  }

  render() {
    return (
      <div className="StoryTime column">
        <Timer code={this.props.code} />
        <div className="font-large">Vote!</div>
        <div className="row vote">{this.renderOptions()}</div>
      </div>
    )
  }
}