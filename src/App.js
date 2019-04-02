import React, { Component } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Landing from './components/Landing';

import Game from './components/game/Index';
import Device from './components/device/Index';

import HowToPlay from './components/pages/HowToPlay';
import Credits from './components/pages/Credits';
import Store from './components/pages/Store';
import Account from './components/pages/Account';

import {getSignIn} from './actions/auth';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {user: false}
  }

  componentDidMount = async ()=> {    
    const user = await getSignIn(user=>this.setState({user}));
    if (user) this.setState({user});
  }
  

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={ Landing } />
          <Route exact path="/game" component={ Game } />
          <Route exact path="/connect" render={props => <Device {...props} user={this.state.user} />}/>
          <Route exact path="/howtoplay" component={ HowToPlay } />
          <Route exact path="/credits" component={ Credits } />
          <Route exact path="/store" component={ Store } />
          <Route exact path="/account" render={props => <Account {...props} user={this.state.user} />}/>
        </div>
      </BrowserRouter>
    )
  }

}

export default App;
