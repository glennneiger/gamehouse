
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import {sendInput} from '../../../../actions';

export default class Caption extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      caption: '',
      captionedMemes: [null, null]
    }
  }

  handleSubmit = timeout => {
    const memes = this.props.request.message;
    let {completed, captionedMemes} = this.state;

    const index = memes[completed].index;
    const caption = document.getElementById('write-caption').value;
    const meme = {index, caption};
    captionedMemes[completed] = meme;
    const {code, playerIndex, request} = this.props;
    completed++;
    this.setState({completed, caption: '', captionedMemes});
    const done = completed === 2;
    sendInput(code, playerIndex, request.type, captionedMemes, done);
    if (done || timeout) {
      this.props.handleSubmit();
    }
  }

  updateText = e=> {
    this.setState({caption: e.target.value});
  }
  
  render() {
    const memes = this.props.request.message;
    const {completed, caption} = this.state;

    return <div className="Meme column">
      <Timer code={this.props.code} onFinish={()=>this.handleSubmit(true)} />
      <div className="row">
        <div className="font-large header">{`Caption ${completed+1} / 2`}</div>
      </div>
      <div>
        <img alt="meme" src={memes[completed ? 1 : 0].image} />
      </div>
      <textarea className="textbox" id="write-caption" maxLength="100" rows="2" onChange={this.updateText} value={caption}></textarea>
      <div className="row">
        <div className="btn" onClick={()=>this.handleSubmit(false)}>Submit</div>
      </div>
    </div>
  }
}


