


import React, {Component} from 'react';

import SelectLocation from './SelectLocation';
import Role from './Role';

import Ad from '../../Ad';

import {requests} from '../../../../actions/requestTypes';

export default class Speakeasy extends Component {

  render() {
    const {request} = this.props;
    if (request !== null) {
      switch (request.type) {

        case requests.speakeasy.newLocation:
          return <SelectLocation {...this.props} />
        case requests.speakeasy.acknowledgeRole:
          return <Role {...this.props} />
          
        default:
          return null;
      }
    } else {
      return <Ad />
    }
  }
}
