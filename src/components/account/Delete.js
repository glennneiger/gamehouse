import React, {Component} from 'react';
import {deleteAccount} from '../../actions/auth';


export default class DeleteAccount extends Component {

  handleSelect = del => {
    if (del) {
      deleteAccount();
    } 
    this.props.deleteAccount(del);
  }

  render() {
    return (
      <div className="DeleteAccount cover-screen">
        <div className="column">
          <p>Are you sure you want to delete your account?</p>
          <p>This can't be undone!</p>
          <div className="row">
            <div className="btn btn-half" onClick={()=>this.handleSelect(true)}>Yes</div>
            <div className="btn btn-half" onClick={()=>this.handleSelect(false)}>No</div>
          </div>
        </div>
      </div>
    ) 
  }
}

