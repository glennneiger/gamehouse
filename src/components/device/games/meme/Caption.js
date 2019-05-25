
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import {sendInput} from '../../../../actions';

export default class Caption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completed: 0
    }
  }

  handleSubmit = () => {
    const memes = this.props.request.message;
    let {completed} = this.state;

    const index = memes[completed].index;
    const caption = document.getElementById('write-caption').value;
    const meme = {index, caption};
    const {code, playerIndex} = this.props;
    completed++;
    this.setState({completed});
    const done = completed === 2;
    sendInput(code, playerIndex, meme, done);
    if (done) {
      this.props.handleSubmit();
    }
  }

  updateText = e=> {
    this.setState({caption: e.target.value});
  }
  
  render() {
    const memes = this.props.request.message;
    const {completed} = this.state;

    return <div className="Meme column">
      <Timer code={this.props.code} onFinish={this.handleSubmit} />
      <div>
        <img alt="meme" src={memes[completed].image} />
      </div>
      <textarea className="textbox" id="write-caption" maxLength="100" rows="2" onChange={this.updateText} value={this.state.caption}></textarea>
      <div className="row">
        <div className="btn" onClick={this.handleSubmit}>Submit</div>
      </div>
    </div>
  }
}


