
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import {sendInput} from '../../../../actions';

export default class Vote extends Component {

  handleSubmit = selection => {
    const {code, playerIndex, request} = this.props;
    sendInput(code, playerIndex, request.type, selection, true);
    this.props.handleSubmit();
  }

  updateText = e=> {
    this.setState({caption: e.target.value});
  }
  
  render() {

    return <div className="Meme column">
      <Timer code={this.props.code} onFinish={()=>this.handleSubmit(null)} />
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


