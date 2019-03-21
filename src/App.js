import React, { Component } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Landing from './components/Landing';

import Game from './components/game/Index';
import Device from './components/device/Index';

import HowToPlay from './components/pages/HowToPlay';
import Credits from './components/pages/Credits';
import Store from './components/pages/Store';
import Account from './components/pages/Account';


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={ Landing } />
          <Route exact path="/game" component={ Game } />
          <Route exact path="/connect" component={ Device } />
          <Route exact path="/howtoplay" component={ HowToPlay } />
          <Route exact path="/credits" component={ Credits } />
          <Route exact path="/store" component={ Store } />
          <Route exact path="/account" component={ Account } />
        </div>
      </BrowserRouter>
    )
  }

}

export default App;
