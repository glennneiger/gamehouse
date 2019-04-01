import React, {Component} from 'react';

export default class MenuLink extends Component {


  handleClick = clicked=> {
    this.props.handleClick(clicked);
  }

  render() {
    if (this.props.entered) {
      if (this.props.clicked) {
        return (
          <div className="column">
            <p>{this.props.text}</p>
            <div className="row">
              <div className="btn btn-half" onClick={this.props.handleAction}>Yes</div>
              <div className="btn btn-half" onClick={()=>this.handleClick(false)}>No</div>
            </div>
          </div>
        )
      }
      return (
        <div className="btn-link" onClick={()=>this.handleClick(true)}>{this.props.caption}</div>
      )
    }
    return null;
  }
}