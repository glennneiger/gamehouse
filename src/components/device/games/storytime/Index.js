


import React, {Component} from 'react';

import Vote from './Vote';
import WriteLine from './WriteLine';
import PlayAgain from '../PlayAgain';

import Ad from '../../other/Ad';

import {requests} from '../../../../actions/requestTypes';

export default class StoryTime extends Component {

  render() {
    const {request} = this.props;
    if (request !== null) {
      switch (request.type) {

        case requests.storyTime.writeLine:
          return <WriteLine {...this.props} />

        case requests.storyTime.vote:
          return <Vote {...this.props} />

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
