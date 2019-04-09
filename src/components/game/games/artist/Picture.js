import React, {Component} from 'react';
import Canvas from 'react-canvas-draw';

const width = Math.round(window.innerWidth/3);

const canvasProps = {
  loadTimeOffset: 0,
  lazyRadius: 0,
  brushRadius: 2,
  brushColor: "#000",
  hideGrid: true,
  canvasWidth: width,
  canvasHeight: width,
  disabled: true,
  imgSrc: "",
  immediateLoading: true
}

export default class Picture extends Component {
  render(){
    return <div className="Picture"><Canvas saveData={this.props.src} {...canvasProps} /></div>
  }
}