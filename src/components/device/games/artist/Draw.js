
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
        brushRadius: 1,
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
      const brushRadius = size/2;
      let className = "swatch";
      if (brushRadius===this.state.canvasProps.brushRadius) className+=' selected';
      return (
        <div key={i} onClick={()=>this.pickSwatch(brushRadius)} className={className}>
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
    const hexcodes = [
      '#ff0000', //red
      '#9B0014', //maroon
      '#FF6000', //red orange
      '#ff9900', //orange
      '#F6EF00', //yellow
      '#41EF00', //bright green
      '#278E00',//dark green
      '#00D4FF', //sky blue
      '#001DF0', //blue
      '#A300FF', // purple
      '#000000', //black
      '#606060', //grey
      '#acacac', //light grey
      '#f9f9f9', //white
      '#573B1D', //dark brown
      '#73522F', //brown
      '#BC9B7C', //tan
      '#F4D5BF', //light tan
      '#FF00EF', // hot pink 
      '#FF72BC' // salmon
      
    ];
    const colors = hexcodes.map((hexcode, i)=>{
      const style={backgroundColor: hexcode}
      return (
        <div key={i} style={style} onClick={()=>this.pickColor(hexcode)} className="color"></div>
      )
    });
    return <div className="picker">{colors}</div>
  }
  
  render() {

    let {message} = this.props.request;

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
      <div className="row">
        <div className="btn" onClick={this.handleSubmit}>Submit</div>
      </div>
    </div>
  }
}


