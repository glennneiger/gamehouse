import React, {Component} from 'react';

import {submitInput} from '../../actions';

export default class StoryTimeVote extends Component {

  submitVote = vote=> {
    let {code, playerIndex} = this.props;
    submitInput(code, playerIndex, vote);
    this.props.handleSubmit();
  }

  renderOptions() {
    let options = Object.values(this.props.options);
    return options.map((option, i)=>(
      <img alt={option.name} key={i} data-imgid={option.img} id={'img-' + i} src={`./assets/img/profiles/${('0' + option.img).slice(-2)}.jpg`}  onClick={()=>this.submitVote(option.index)}></img>
    ));
  }

  render() {
    return (
      <div className="StoryTime">
        <div>Vote!</div>
        <div className="column">{this.renderOptions()}</div>
      </div>
    )
  }
}