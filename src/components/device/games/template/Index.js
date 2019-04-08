


import React, {Component} from 'react';

import PlayAgain from '../PlayAgain';

import Ad from '../../other/Ad';

import {requests} from '../../../../actions/requestTypes';

export default class Game extends Component {

  render() {
    const {request} = this.props;
    if (request !== null) {
      switch (request.type) {

        case requests.playAgain:
          return <PlayAgain {...this.props} />
          
        default:
          return null;
      }
    } else {
      return <Ad />
    }
  }
}
