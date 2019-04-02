import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import Logo from './Logo';
import CustomizeAccount from '../account/Customize';
import SignIn from '../account/SignIn';
import Delete from '../account/Delete';

import {signOut, updateUser} from '../../actions/auth';

export default class Account extends Component {

  constructor(props) {
    super(props);
    const playerName = props.user ? props.user.name : '';
    this.state = {
      playerName,
      showDeleteMenu: false,
      deleted: false
    }
  }


  componentDidUpdate(oldProps) {
    const {user} = this.props;
    if(user && (!oldProps.user || user.name !== oldProps.user.name)) {
      const playerName = user.name;
      this.setState({playerName, deleted: false});
    }
  }

  componentWillUnmount() {
    if (!this.props.user) return;
    const name = this.state.playerName.trim();
    if (name) updateUser({name});
  }

  deleteAccount = del=> {
    if (del) {
      this.setState({deleted: true});
    }
    this.setState({showDeleteMenu: false});
  }

  renderContent = ()=> {
    const {playerName} = this.state;
    const {user} = this.props;
    if (user===false) {
      return <div><div className="lds-facebook"><div></div><div></div><div></div></div></div>
    } else if (user && !this.state.deleted) {
      return (
        <div>
          {this.state.showDeleteMenu ? <Delete deleteAccount={this.deleteAccount} /> : null}
          <CustomizeAccount user={user} handleInputChange={playerName=>this.setState({playerName})} name={playerName} />
          <div className="btn-link" onClick={signOut}>Sign Out</div>
          <div className="btn-link" onClick={()=>this.setState({showDeleteMenu:true})}>Delete Account</div>
        </div>
      )
    } else {
      return ( 
        <div>
          <div>Sign In:</div>
          <SignIn />
        </div>
      )
    }
  }

  render() {
    return (
      <div className="device page">
        <div className="column">
          <Logo />
          <div className="content">
            {this.renderContent()}
          </div>
          <Link to="/" className="btn">{this.props.user ? 'Done' : 'Back'}</Link>
          <br/>
        </div>
      </div>
    )
  }
}