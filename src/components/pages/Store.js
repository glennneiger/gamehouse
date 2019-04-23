import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import Logo from './Logo';

export default class Store extends Component {

  render() {
    return (
      <div className="device page">
        <div className="column">
          <Logo />
          <div className="content">
            <p>Under Construction</p>
            <p>Here you'll be able to browse new games as they're released!</p>
          </div>
          <Link to="/" className="btn">Back</Link>
          <br/>
        </div>
      </div>
    )
  }
}