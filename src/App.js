import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Computer from './components/Computer';
import Device from './components/Device';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="Computer">

            <Route path="/" component={ Computer } />

          </div>

          
          <div className="Device">

            <Route path="/" component={ Device } />

          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
