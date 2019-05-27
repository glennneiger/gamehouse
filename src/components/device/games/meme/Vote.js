
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import {sendInput} from '../../../../actions';

export default class Vote extends Component {

  handleSubmit = selection => {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, selection, true);
    this.props.handleSubmit();
  }

  updateText = e=> {
    this.setState({caption: e.target.value});
  }
  
  render() {

    return <div className="Meme column">
      <Timer code={this.props.code} onFinish={this.handleSubmit} />
      <div className="row">
        <div className="option" onClick={()=>this.handleSubmit(0)}>
          A
        </div>
        <div className="option" onClick={()=>this.handleSubmit(1)}>
          B
        </div>
      </div>
    </div>
  }
}


