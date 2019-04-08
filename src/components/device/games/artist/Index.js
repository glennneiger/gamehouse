


import React, {Component} from 'react';

import PlayAgain from '../PlayAgain';

import Draw from './Draw';
import Type from './Type';

import Ad from '../../other/Ad';

import {requests} from '../../../../actions/requestTypes';

export default class Artist extends Component {

  render() {
    const {request} = this.props;
    if (request !== null) {
      switch (request.type) {

        case requests.artist.draw:
          return <Draw {...this.props} />

        case requests.artist.type:
          return <Type {...this.props} />


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
