import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Ad from './device/Ad';


class Landing extends Component {

  constructor(props) {
    super(props);
    this.state=({showNotice:false});
  }

  renderComputerDisplay(){
    let content;
    if (this.state.showNotice) {
      content = <div className="column">
        <p className="notice">Party House is an interactive, multiplayer party game featuring music, voice, and sound effects.</p>
        <Link to="/game" className="btn">Start the Party!</Link>
        <div className="btn" onClick={()=>this.setState({showNotice: false})}>Back</div>
        <div className="v-10"></div>
      </div>
    } else {
      content = <div className="row">
        <div className="column option" onClick={()=>this.setState({showNotice: true})}>
          <div className="icon"><i className="fas fa-tv"></i></div>
          <div>Display</div>
        </div>
        <Link to="/connect" className="column option">
          <div className="icon"><i className="fas fa-tablet-alt"></i></div>
          <div>Input</div>
        </Link>
      </div>
    }

    return (
      <div className="Landing center-screen">
        <div>
          <div className="logo">
            <img className="logo" src="./assets/img/logo.svg" alt="Party House" />
          </div>
          {content}
          <div className="v-10"></div>
        </div>
      </div>
    )
  }

  renderMobileDisplay(){
    return (
      <div className="device">
        <img className="logo" src="./assets/img/logo2.svg" alt="Party House" />
        <Link to="/connect" className="btn">Join Party</Link>
        <Link to="/account" className="btn">My Account</Link>
        <Link to="/howtoplay" className="btn">How to Play</Link>
        <Link to="/credits" className="btn">Credits</Link>
        <Ad />
      </div>
    )
  }

  render () {
    if (window.screen.availWidth > 900) {
      return this.renderComputerDisplay();
    } else {
      return this.renderMobileDisplay();
    }
  }
};

export default Landing;