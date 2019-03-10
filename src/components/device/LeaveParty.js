import React, {Component} from 'react';

export default class LeaveParty extends Component {


  handleClickLeave = clicked=> {
    this.props.handleClickLeave(clicked);
  }

  render() {
    if (this.props.entered) {
      if (this.props.clicked) {
        return (
          <div className="column">
            <p>Are you sure you want to leave the party?</p>
            <div className="row">
              <div className="btn btn-half" onClick={this.props.handleLeaveRoom}>Yes</div>
              <div className="btn btn-half" onClick={()=>this.handleClickLeave(false)}>No</div>
            </div>
          </div>
        )
      }
      return (
        <div className="btn-leave" onClick={()=>this.handleClickLeave(true)}>Leave Party</div>
      )
    }
    return null;
  }
}