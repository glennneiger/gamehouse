// customize name and picture

import React, {Component} from 'react';

import ImgCrop from './ImgCrop';
import ProfilePicture from './ProfilePicture';
import {updateUser} from '../../actions/auth';

export default class Customize extends Component {
  constructor(props) {
    super(props);
    const {img, name} = props.user;
    this.state = {
      img, 
      name,
      uploadedImg: null
    }
  }


  handleNewImage = img=> {
    if (img) {
      this.setState({img});
      updateUser({img});
    };
    this.setState({uploadedImg: null});
  }

  render() {
    const {uploadedImg, img, name} = this.state;
    if (uploadedImg) {
      return <div><ImgCrop img={uploadedImg} returnImage={this.handleNewImage} /></div>;
    } else {
      return (
        <div className="CustomizeAccount column">
          <div>Name:</div>
          <input 
            type="text" 
            className="textbox" 
            id="player-name"
            maxLength="12" 
            autoComplete="off" 
            spellCheck={false} 
            name="playerName" 
            value={this.props.name}
            onChange={e=>this.props.handleInputChange(e.target.value)}
          />
          <div>Picture:</div>
          <ProfilePicture img={img} name={name} handleFileSelect={uploadedImg=>this.setState({uploadedImg})}/>
        </div>
      )
    }
  }
}