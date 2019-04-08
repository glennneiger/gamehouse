
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import Canvas from 'react-canvas-draw';

import {sendInput} from '../../../../actions';

export default class Type extends Component {

  constructor(props) {
    super(props);
    this.state={
      canvasProps: {
        loadTimeOffset: 0,
        lazyRadius: 0,
        brushRadius: 2,
        brushColor: "#000",
        catenaryColor: "#0a0302",
        gridColor: "rgba(150,150,150,0.17)",
        hideGrid: true,
        canvasWidth: 200,
        canvasHeight: 200,
        disabled: true,
        imgSrc: "",
        saveData: props.request.message,
        immediateLoading: true
      },
      caption: ''
    }
  }

  handleSubmit = () => {
    const {code, playerIndex} = this.props;
    sendInput(code, playerIndex, this.state.caption, true);
    this.props.handleSubmit();
  }

  updateText = e=> {
    this.setState({caption: e.target.value});
  }
  
  render() {
    return <div className="Artist column">
      <Timer code={this.props.code} onFinish={this.handleSubmit} />
      <div className="canvas-container">
        <Canvas {...this.state.canvasProps} ref={canvasDraw => (this.loadableCanvas = canvasDraw)} />
      </div>
      <textarea className="textbox" id="write-caption" maxLength="100" rows="2" onChange={this.updateText} value={this.state.caption}></textarea>
    </div>
  }
}


