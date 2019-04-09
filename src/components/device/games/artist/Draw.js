
import  React, {Component} from 'react';

import Timer from '../../other/Timer';

import Canvas from 'react-canvas-draw';

import {sendInput} from '../../../../actions';

export default class Draw extends Component {

  constructor(props) {
    super(props);
    this.state={
      canvasProps: {
        loadTimeOffset: 0,
        lazyRadius: 0,
        brushRadius: 2,
        brushColor: "#000",
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

  pickSwatch = size=> {
    let {canvasProps} = this.state;
    canvasProps['brushRadius'] = size;
    this.setState({canvasProps});
  }

  renderSwatchPicker() {
    const sizes = [2, 6, 16, 30, 50];
    const swatches = sizes.map((size, i)=>{
      const style={width: `${size}px`, height: `${size}px`, backgroundColor: this.state.canvasProps.brushColor, borderRadius: '50%'}
      return (
        <div key={i} onClick={()=>this.pickSwatch(size/2)} className="swatch">
          <div style={style}></div>
        </div>
      )
    });
    return <div className="picker">{swatches}</div>
  }


  pickColor = hexcode=> {
    let {canvasProps} = this.state;
    canvasProps['brushColor'] = hexcode;
    this.setState({canvasProps});
  }

  renderColorPicker() {
    const hexcodes = ['#000000','#ff0000','#ff9900','#F3EF00','#37CB00','#00E2F0','#001DF0','#A300FF','#FF00EF','#7C4F1C'];
    const colors = hexcodes.map((hexcode, i)=>{
      const style={backgroundColor: hexcode}
      return (
        <div key={i} style={style} onClick={()=>this.pickColor(hexcode)} className="color"></div>
      )
    });
    return <div className="picker">{colors}</div>
  }
  
  render() {

    const {message} = this.props.request;

    return <div className="Artist">
      <div className="row">
        <Timer code={this.props.code} onFinish={this.handleSubmit} />
      </div>
      <div className="row">
        <div className="font-large header">{message}</div>
      </div>
      <div className="row">
        <div className="canvas-container">
          <Canvas {...this.state.canvasProps} ref={canvasDraw => (this.saveableCanvas = canvasDraw)} />
        </div>
      </div>
      {this.renderColorPicker()}
      {this.renderSwatchPicker()}
    </div>
  }
}


