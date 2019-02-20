import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import firebase from 'firebase';

import Computer from './components/Computer';
import Device from './components/Device';

class App extends Component {

  componentWillMount() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDQjtiZ2Z-uge24UdgzOzBPDocn54kQDSc",
      authDomain: "jacobsgamehouse.firebaseapp.com",
      databaseURL: "https://jacobsgamehouse.firebaseio.com",
      projectId: "jacobsgamehouse",
      storageBucket: "jacobsgamehouse.appspot.com",
      messagingSenderId: "529121111976"
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="Computer" id="ComputerDisplay">

            <Route path="/" component={ Computer } />

          </div>

          
          <div className="Device" id="DeviceDisplay">

            <Route path="/" component={ Device } />

          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
