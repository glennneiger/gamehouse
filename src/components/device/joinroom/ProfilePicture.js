import React, {Component} from 'react';

function buildFileSelector(){
  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.setAttribute('accept', 'image/*');
  return fileSelector;
}

class ProfilePicture extends Component {

  constructor(props) {
    super(props);
    this.state={
      src: props.img
    }
  }

  componentDidMount(){
    this.fileSelector = buildFileSelector();
    this.fileSelector.addEventListener('change', this.openFile);
  }

  componentDidUpdate() {
    if (!this.state.src && this.props.img) {
      this.setState({src: this.props.img});
    }
  }

  openFile = ()=> {
    const file = this.fileSelector.files[0];
    let reader  = new FileReader();
    reader.addEventListener("load", ()=> {
      this.props.handleFileSelect(reader.result);
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.fileSelector.click();
  }

  render(){
    return (
      <div id="profile-picture-container">
        <div id="change" onClick={this.handleFileSelect}><i className="fas fa-camera"></i></div>
        <img alt={`${this.props.name}'s Profile`} src={this.state.src} />
      </div>
    )
  } 
}

export default ProfilePicture;