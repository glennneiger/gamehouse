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
          </div>
          <Link to="/" className="btn">Back</Link>
        </div>
      </div>
    )
  }
}