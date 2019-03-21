import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import Logo from './Logo';

export default class Credits extends Component {

  render() {
    return (
      <div className="device page">
        <div className="column">
          <Logo />
          <div className="content">
            <p>Party House Games</p>
            <p>Created By:<br /><span className="font-large">Jacob Garcia</span></p>
            <p>Music By:<br />
            Kevin MacLeod (incompetech.com)<br />
            Licensed under the Creative Commons 3.0:<br />By Attribution license.</p>
          </div>
          <Link to="/" className="btn">Back</Link>
        </div>
      </div>
    )
  }
}