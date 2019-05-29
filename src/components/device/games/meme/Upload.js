
import  React, {Component} from 'react';


import {sendInput} from '../../../../actions';

import Crop from './Crop';


function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  return fileSelector;
}

//select four indices for images
function selectIntegers(amount, max) {
  let res = [];
  while (res.length < amount) {
    const rndX = Math.floor(Math.random()*(max+1));
    if (!res.includes(rndX)) {
      res.push(rndX);
    }
  }
  return res;
}

export default class Upload extends Component {

  constructor(props) {
    super(props);

    const imageIndices = selectIntegers(8, 33);

    this.state = {
      uploads: [],
      currentImg: null,
      imageIndices
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
    const {code, playerIndex, request} = this.props;
    let {uploads} = this.state;
    uploads.push(image);
    this.setState({uploads});
    if (uploads.length===2) {
      sendInput(code, playerIndex, request.type, uploads, true);
      this.props.handleSubmit();
    }
  }

  handleNewImage = img => {
    this.setState({currentImg:null});
    if (img) {
      this.handleSubmit(img);
    }
  }

  renderImages = ()=> {
    const uploadCount = this.state.uploads.length;
    const start = !uploadCount ? 0 : 4;
    const end = !uploadCount ? 4 : 8;
    const imageIndices = this.state.imageIndices.slice(start, end);
    return imageIndices.map(index=> <img alt="meme" key={index} src={`assets/img/meme/${index}.png`} onClick={()=>this.setState({currentImg:index})} />);
  };
  
  render() {
    const {currentImg} = this.state;

    return <div className="Meme">
      {(currentImg || currentImg===0) ? <Crop img={currentImg} returnImage={this.handleNewImage} /> : null}
      <div className="row">
        <div className="font-large header">{`Image ${this.state.uploads.length+1} / 2`}</div>
      </div>
      <div className="row">
        <div className="btn" onClick={this.handleFileSelect}>Upload Image</div>
      </div>
      <div className="row font-large header">
        Or select:
      </div>
      <div className="images">
        {this.renderImages()}
      </div>
    </div>
  }
}


