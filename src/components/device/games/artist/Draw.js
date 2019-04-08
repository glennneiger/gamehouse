
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import Canvas from 'react-canvas-draw';

import {sendInput} from '../../../../actions';

export default class Draw extends Component {

  constructor(props) {
    super(props);
    this.state={
      canvasProps: {
        loadTimeOffset: 5,
        lazyRadius: 0,
        brushRadius: 2,
        brushColor: "#000",
        catenaryColor: "#0a0302",
        gridColor: "rgba(150,150,150,0.17)",
        hideGrid: true,
        canvasWidth: 300,
        canvasHeight: 300,
        disabled: false,
        imgSrc: "",
        saveData: null,
        immediateLoading: true
      }
    }
  }

  handleSubmit = () => {
    const {code, playerIndex} = this.props;
    const drawing=this.saveableCanvas.getSaveData();
    sendInput(code, playerIndex, drawing, true);
    this.props.handleSubmit();
  }

  
  render() {

    const {message} = this.props.request;

    return <div className="Artist column">
      <Timer code={this.props.code} onFinish={this.handleSubmit} />
      <div className="font-large header">{message}</div>
      <div className="canvas-container">
        <Canvas {...this.state.canvasProps} ref={canvasDraw => (this.saveableCanvas = canvasDraw)} />
      </div>
    </div>
  }
}


