


import React, {Component} from 'react';

import Vote from './Vote';
import WriteLine from './WriteLine';

import Ad from '../../Ad';

import {requests} from '../../../../actions/requestTypes';

export default class StoryTime extends Component {

  render() {
    const {request} = this.props;
    if (request) {
      switch (request.type) {

        case requests.storyTime.writeLine:
          return <WriteLine {...this.props} />
          
        default:
          return <Vote {...this.props} />
      }
    } else {
      return <Ad />
    }
  }
}
