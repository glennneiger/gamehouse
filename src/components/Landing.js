import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Ad from './device/other/Ad';


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
      <div className="Landing">
        <div className="navbar row">
          <Link to="/howtoplay">How to Play</Link>
          <Link to="/credits">Credits</Link>
          <Link to="/store">Games</Link>
          <Link to="/account">My Account</Link>
        </div>
        <div>
          <div className="logo">
            <img className="logo" src="./assets/img/logo.svg" alt="Party House" />
          </div>
          {content}
        </div>
      </div>
    )
  }

  renderMobileDisplay(){
    return (
      <div className="device deviceLanding">
        <img className="logo" src="./assets/img/logo2.svg" alt="Party House" />
        <Link to="/connect" className="btn">Join Party!</Link>
        <div className="row">
          <Link to="/account"><div className="btn-square"><div><i className="fas fa-user"></i></div><div>My Account</div></div></Link>
          <Link to="/store"><div className="btn-square"><div><i class="fas fa-dice"></i></div><div>Browse Games</div></div></Link>
        </div>
        <div className="row">
          <Link to="/howtoplay"><div className="btn-square"><div><i class="fas fa-question-circle"></i></div><div>How to Play</div></div></Link>
          <Link to="/credits"><div className="btn-square"><div></div><i class="fas fa-trophy"></i><div>Credits</div></div></Link>
        </div>
        <Ad />
        <br/>
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