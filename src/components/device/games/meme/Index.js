
import React, {Component} from 'react';

import PlayAgain from '../PlayAgain';

import Upload from './Upload';
import Caption from './Caption';

import Ad from '../../other/Ad';

import {requests} from '../../../../actions/requestTypes';

export default class Meme extends Component {

  render() {
    const {request} = this.props;
    if (request !== null) {
      switch (request.type) {

        case requests.meme.upload:
          return <Upload {...this.props} />

        case requests.meme.caption:
          return <Caption {...this.props} />


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
