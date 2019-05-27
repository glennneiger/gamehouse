
import  React, {Component} from 'react';


import {sendInput} from '../../../../actions';

import Crop from './Crop';


function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  return fileSelector;
}

export default class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uploads: [],
      currentImg: null
    }
  }


  componentDidMount(){
    this.fileSelector = buildFileSelector();
    this.fileSelector.addEventListener('change', this.openFile);
  }

  openFile = ()=> {
    const file = this.fileSelector.files[0];
    let reader  = new FileReader();
    reader.addEventListener("load", ()=> {
      this.setState({currentImg: reader.result});
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.fileSelector.click();
  }



  handleSubmit = image => {
    const {code, playerIndex} = this.props;
    let {uploads} = this.state;
    uploads.push(image);
    this.setState({uploads});
    if (uploads.length===2) {
      sendInput(code, playerIndex, uploads, true);
      this.props.handleSubmit();
    }
  }

  handleNewImage = img => {
    this.setState({currentImg:null});
    if (img) {
      this.handleSubmit(img);
    }
  }

  
  render() {
    const {currentImg} = this.state;

    return <div className="Meme">
      {currentImg ? <Crop img={currentImg} returnImage={this.handleNewImage} /> : null}
      <div className="row">
        <div className="font-large header">{`Upload ${this.state.uploads.length+1} / 2`}</div>
      </div>
      <div className="row">
        <div className="btn" onClick={this.handleFileSelect}>Select Image</div>
      </div>
    </div>
  }
}


